'use strict';

const { red } = require("colors");
const request = require("@jssj/request");
const getConfig = require("../getConfig");
const { debug } = require("../utils/debug");
const config = getConfig();
const MERGE_REQUESTS_NOTES_URL = `${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests`;
async function createMergeRequestNotes({
  iid,
  body,
  created_at,
  token
}) {
  const params = {
    body,
    created_at,
    private_token: token
  };
  const fetchData = await request.post({
    url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestNotesList({
  iid,
  token,
  sort = "desc",
  order_by = "created_at"
}) {
  const params = {
    sort,
    order_by,
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function getMergeRequestNotesDetail({
  id,
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.get({
    url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
    data: params
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function updateMergeRequestNotes({
  id,
  iid,
  body,
  token
}) {
  const fetchData = await request.put({
    url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
    data: {
      body,
      private_token: token
    },
    options: { error: true }
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
async function deleteMergeRequestNotes({
  id,
  iid,
  token
}) {
  const params = {
    private_token: token
  };
  const fetchData = await request.delete({
    url: `${MERGE_REQUESTS_NOTES_URL}/${iid}/notes/${id}`,
    data: params,
    options: { error: true }
  });
  debug("fetchData", fetchData);
  if (fetchData && "message" in fetchData) {
    const message = fetchData.message ? [].concat(fetchData.message).join("") : "\u8BF7\u6C42\u62A5\u9519\u4E86";
    return Promise.reject(red(message));
  }
  return fetchData;
}
module.exports = {
  createMergeRequestNotes,
  getMergeRequestNotesList,
  getMergeRequestNotesDetail,
  updateMergeRequestNotes,
  deleteMergeRequestNotes
};
