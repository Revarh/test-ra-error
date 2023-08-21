import { supabaseDataProvider } from 'ra-supabase';
import { supabaseClient } from './supabase';

const baseDataProvider = supabaseDataProvider({
    instanceUrl: process.env.REACT_APP_SUPABASE_URL,
    apiKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    supabaseClient
});

export default baseDataProvider;