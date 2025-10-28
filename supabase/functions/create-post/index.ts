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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), 
        {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }), 
        {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }), 
        {
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    const { title, content, images, type, is_featured, slug } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }), 
        {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    const { data: post, error: postError } = await supabaseClient
      .from('posts')
      .insert({
        title,
        content,
        images: images || [],
        type: type || 'article',
        is_featured: is_featured || false,
        slug: slug || null,
        author_id: profile.id,
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
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
        status: 201,
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