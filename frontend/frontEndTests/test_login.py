from runLogin import login_test, message_test, make_room_test, delete_room_test
from unit_tests import view_room_invite_test, view_room_test, deauthed_url_test
import pytest
from selenium.common.exceptions import NoSuchElementException
import random
import string

def generate_random_string(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    random_string = ''.join(random.choice(characters) for i in range(length))
    return random_string
room_name = generate_random_string(12)
def test_unit_tests():
    assert view_room_test(id = "665a719f6a668ea08588689a", expected_result="Max's Actual Room")
    assert deauthed_url_test("""http://localhost:5173/tester/1""")
    assert deauthed_url_test("""http://localhost:5173/home""")
    assert deauthed_url_test("""http://localhost:5173/home/dsafasdf""")
    assert deauthed_url_test("""http://localhost:5173/"""+generate_random_string(12))
    assert view_room_invite_test(link = "ad3e7bb1-bc09-42c6-9215-2195b703bb63", expected_result="Max's Actual Room")
def test_login():
    assert login_test()

def test_bad_login():
    with pytest.raises(NoSuchElementException):
        assert login_test("wrong", "name")
def test_empty_message():
    assert message_test(message = "") == False
def test_good_message():
    assert message_test( message = generate_random_string(8))
def test_make_room():
    make_room_test(room_name=  room_name)
def test_delete_room():
    delete_room_test(room_name= room_name )
