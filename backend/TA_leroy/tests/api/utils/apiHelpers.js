// export const createSession = async (api, payload) => {
//   const payload = createSessionData();
  
//   const res = await api.post('/api/sessions', { data: payload });

//   if (res.status() !== 201) {
//     console.error("CREATE FAILED:", payload);
//     console.error(await res.text());
//   }

//   return res;
// };

//Random session en createSessionData goed zetten

// REVIEW 🟡 MEDIUM: The `createSessionData` parameter is accepted but never used — the function always calls `randomSession()` on line 23.
// FIX: Either remove the param: `async (api, count) =>` or use it: `const payload = createSessionData ? createSessionData() : randomSession();`
export const createSessions = async (api, count, createSessionData) => {

  const payloads = [];
  const responses = [];

  for (let i = 0; i < count; i++) {

    const payload = randomSession();

    const res = await api.post('/api/sessions', { data: payload });

    if (res.status() !== 201) {
      console.error("CREATE FAILED:", payload);
      console.error(await res.text());
    }

    const body = await res.json();

    payloads.push(payload);
    responses.push(body);
  }

  return { payloads, responses };
};

export const getSession = (api, id) =>
  api.get(`/api/sessions/${id}`);

export const updateSession = (api, id, payload) =>
  api.put(`/api/sessions/${id}`, { data: payload });

export const deleteSession = (api, id) =>
  api.delete(`/api/sessions/${id}`);