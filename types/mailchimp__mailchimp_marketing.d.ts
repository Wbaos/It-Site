declare module '@mailchimp/mailchimp_marketing' {
  type TagStatus = 'active' | 'inactive';

  type Tag = {
    name: string;
    status: TagStatus;
  };

  type UpdateMemberTagsBody = {
    tags: Tag[];
  };

  type SetListMemberBody = {
    email_address: string;
    status?: string;
    status_if_new?: string;
    merge_fields?: Record<string, unknown>;
    [key: string]: unknown;
  };

  interface ListsApi {
    setListMember(listId: string, subscriberHash: string, body: SetListMemberBody): Promise<unknown>;
    updateListMemberTags(listId: string, subscriberHash: string, body: UpdateMemberTagsBody): Promise<unknown>;
  }

  interface MailchimpClient {
    setConfig(config: { apiKey: string; server: string }): void;
    lists: ListsApi;
  }

  const client: MailchimpClient;
  export default client;
}
