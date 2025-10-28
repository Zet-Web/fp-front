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

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Post ID is required' }), 
        {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    const { error: deleteError } = await supabaseClient
      .from('posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      return new Response(
        JSON.stringify({ error: deleteError.message }), 
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
      JSON.stringify({ success: true }), 
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