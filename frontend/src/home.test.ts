import { fetch_user_data, current_user_data  } from "./api_function";
import { Cookies } from "react-cookie";
test('the data is peanut butter', async () => {

  Cookies.set('Authorization', "none");
  const data = await current_user_data();
  expect(data).toBe('peanut butter');
});