import { supabaseClient } from './supabase';
import baseDataProvider from './baseDataProvider';

const leadsDataProvider = {
  ...baseDataProvider,
  getList: async (resource, params) => {
    resource = 'leads_view';
    let result = null;

    // When event_ids and multi_search are both present
    if (params?.filter && params.filter.event_ids && params.filter.multi_search) {
      params.filter['event_ids@cs'] = `{${params.filter.event_ids}}`;
      delete params.filter.event_ids;

      const { data, error } = await supabaseClient
        .from(resource)
        .select('*')
        .or(`first_name.ilike.%${params.filter.multi_search}%,last_name.ilike.%${params.filter.multi_search}%,email.ilike.%${params.filter.multi_search}%,phone.ilike.%${params.filter.multi_search}%`)
        .filter('event_ids@cs', `{${params.filter.event_ids}}`);

      if (error) {
        throw error;
      }

      delete params.filter.multi_search;
      result = await baseDataProvider.getList(resource, params);

      // Filter the data to include only records where first_name, last_name, email, or phone match the multi_search value
      result.data = result.data.filter(record =>
        data.some(profile =>
          profile.id === record.id
        )
      );
      result.total = result.data.length;

      return result;
    }

    // When only event_ids is present
    if (params?.filter && params.filter.event_ids) {
      params.filter['event_ids@cs'] = `{${params.filter.event_ids}}`;

      delete params.filter.event_ids;
      result = await baseDataProvider.getList(resource, params);
      return result;
    }

    // When only multi_search is present
    if (params?.filter && params.filter.multi_search) {
      const { data, error } = await supabaseClient
        .from(resource)
        .select('*')
        .or(`first_name.ilike.%${params.filter.multi_search}%,last_name.ilike.%${params.filter.multi_search}%,email.ilike.%${params.filter.multi_search}%,phone.ilike.%${params.filter.multi_search}%`);

        console.log('>>', data.length);
      if (error) {
        throw error;
      }

      delete params.filter.multi_search;
      result = await baseDataProvider.getList(resource, params);
      console.log('>>>>>>', result.data.length);

      result.data = result.data.filter(record =>
        data.some(profile =>
          profile.id === record.id
        )
      );
      result.total = result.data.length;

      return result;
    }

    // When neither event_ids nor multi_search is present
    result = await baseDataProvider.getList(resource, params);

    // if (result.data && Array.isArray(result.data)) {
    //   result.data = result.data.map(record => {
    //     if (record.event_ids && Array.isArray(record.event_ids)) {
    //       record.event_ids = record.event_ids.map(id => id?.replace(/cs.\{(\d+)\}/, '$1'));
    //     }
    //     return record;
    //   });
    // }

    return result;
  },
};

export default leadsDataProvider;