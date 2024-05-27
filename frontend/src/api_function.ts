import Cookies from "js-cookie"
export async function fetch_contacts(){
   const data = await fetch(`http://localhost:3000/contact/list`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data.contacts; 
}

export async function fetch_user_data(userId) {
    const data = await fetch(`http://localhost:3000/user/id?id=${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data;
}

export async function current_user_data(){
    const data = await fetch(`http://localhost:3000/account/info`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data.account;
}

export async function make_user_dict(userIds) {
  const user_dict = {};
  const uniqueSenders = [...new Set(userIds)];

  await Promise.all(uniqueSenders.map(async (senderId) => {
      const data = await fetch_user_data(senderId);
      user_dict[senderId] = data;
  }));

  return user_dict;
}