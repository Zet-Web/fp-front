import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const slug = url.searchParams.get('slug');

    if (!id && !slug) {
      return new Response(
        JSON.stringify({ error: 'Post ID or slug is required' }), 
        {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    let query = supabaseClient
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(
          id,
          name,
          username,
          avatar_url,
          badge,
          telegram_username
        )
      `);

    if (id) {
      query = query.eq('id', id);
    } else if (slug) {
      query = query.eq('slug', slug);
    }

    const { data: post, error: postError } = await query.single();

    if (postError) {
      console.error('Error fetching post:', postError);
      
      if (postError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Post not found' }), 
          {
            status: 404,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: postError.message }), 
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    return new Response(
      JSON.stringify(post), 
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    );
  }
});