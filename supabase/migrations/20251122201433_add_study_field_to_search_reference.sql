/*
  # Add study_field support to search_reference function

  1. Changes
    - Add 'study_field' as a valid type parameter
    - Map 'study_field' type to 'list_study_field' table
    - Add conditional logic to return all records when search query is empty
    - Maintain existing search functionality for non-empty queries
  
  2. Behavior
    - When p_search_query is empty or null: returns all records ordered alphabetically
    - When p_search_query has value: filters records by name/name_ru
    - Works for all reference types: city, country, region, university, study_field
  
  3. Notes
    - This enables study_field dropdown to show all options immediately
    - Users can still search/filter if needed
    - Consistent with other reference selector patterns
*/

CREATE OR REPLACE FUNCTION search_reference(
  p_type TEXT,
  p_search_query TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  name_en TEXT,
  code TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_table_name TEXT;
BEGIN
  -- Determine table name based on type
  CASE p_type
    WHEN 'city' THEN
      v_table_name := 'list_city';
    WHEN 'country' THEN
      v_table_name := 'list_country';
    WHEN 'region' THEN
      v_table_name := 'list_region';
    WHEN 'university' THEN
      v_table_name := 'list_university';
    WHEN 'study_field' THEN
      v_table_name := 'list_study_field';
    ELSE
      RAISE EXCEPTION 'Invalid type parameter. Must be: city, country, region, university, or study_field';
  END CASE;

  -- Handle empty search query (return all records)
  IF p_search_query IS NULL OR TRIM(p_search_query) = '' THEN
    RETURN QUERY EXECUTE format(
      'SELECT 
        id::INTEGER,
        COALESCE(name_ru, name) as name,
        name as name_en,
        COALESCE(code, '''') as code
      FROM %I
      ORDER BY COALESCE(name_ru, name)
      LIMIT $1',
      v_table_name
    )
    USING p_limit;
  ELSE
    -- Execute dynamic query with search filter
    RETURN QUERY EXECUTE format(
      'SELECT 
        id::INTEGER,
        COALESCE(name_ru, name) as name,
        name as name_en,
        COALESCE(code, '''') as code
      FROM %I
      WHERE 
        name ILIKE $1 OR
        name_ru ILIKE $1
      ORDER BY 
        CASE 
          WHEN name_ru ILIKE $1 || ''%%'' THEN 1
          WHEN name ILIKE $1 || ''%%'' THEN 2
          ELSE 3
        END,
        COALESCE(name_ru, name)
      LIMIT $2',
      v_table_name
    )
    USING '%' || p_search_query || '%', p_limit;
  END IF;
END;
$$;
