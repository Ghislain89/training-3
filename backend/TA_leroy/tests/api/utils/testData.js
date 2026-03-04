export const sessionData = {
  valid: {
    title: 'API Test Session',
    description: 'Created via Playwright API test',
    status: 'Pending',
    duration: 2.5,
  },
  updated: {
    title: 'API Test Session Updated',
    description: 'Updated via Playwright API test',
    status: 'In Progress',
    duration: 3.0,
  }
};

export const randomUser = () => ({
  username: `user_${Date.now()}`,
  password: 'pw-' + Math.random().toString(36).slice(2, 8),
});

export const createUser = async (api) => {
  const user = randomUser();
  await api.post('/api/create-account', user);
  return user;
};

