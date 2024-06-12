// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import NavScroll from '../../src/nav.tsx';
import Cookies from 'js-cookie';
describe('Login component tests', () => {

  beforeEach(() => {
    // write someting before each test
  });

  afterEach(() => {
    // write someting after each test
  });

  it('Renders correctly initial document', async () => {
    /* first we visit /login and test if the string in the element with class "login-label"  has"Please Log In" is there */
    Cookies.set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3NGRiYmE4ZmFlZTY5YWNhZTFiYzFiZTE5MDQ1MzY3OGY0NzI4MDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNzIyOTMwMDk4OTctdDdlaTFvZGFlOWsyOWFlZ3IyNnJ0YzQ3MXQwOGJraHAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNzIyOTMwMDk4OTctdDdlaTFvZGFlOWsyOWFlZ3IyNnJ0YzQ3MXQwOGJraHAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgzNTg0NjA5MjU2MDA1OTMyMTkiLCJhdF9oYXNoIjoiN21vWHpRZExpUjBMZE9tVHNtX0FUUSIsIm5hbWUiOiJNYWNrZW56aWUgTm9ybWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tnMXU4Z0lKaWR1NkJsUDU1aXROTEhPaloyZjF1WjdZdl9NWXdCbE1zSmlZajZ1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJNYWNrZW56aWUiLCJmYW1pbHlfbmFtZSI6Ik5vcm1hbiIsImlhdCI6MTcxNzM3Mjg5NywiZXhwIjoxNzE3Mzc2NDk3fQ.lZ1gWqdnxyNhbOLYnlKwTjYLGtXJgOIUtJRyW3QZbJo7mX7FDhTLZ492fGT3XviJOooe1-oC1y3EOrsWe1sPOc9GZTjFYkAV9VquDGfUAUY6lFUBc7P7juRf6rkm6miacZ_xeHM_KJKNBhV_qx8feNigmx_iGc93UpHY5E4YCBpQHPHyCtQ2XiWYl6IG_tFjBKfoY6OEbZeHkjg2QTFntAG1YBRTmQy-EctfjX8fvleq9K1Dca4g7L24QaarNhWuEnuxuj7Asm4tUWvewssdsxRQ4dT7GWcxHeV0S5JyElXb05NSQOIeP6v-afOWxlSZvS14DVopYTRAU4eaWpdq7w")
    render(
        <NavScroll></NavScroll>
    );
    const loginLabel = screen.getByText('Please Log In');

    expect(loginLabel).toBeInTheDocument();
  });

});