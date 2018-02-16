import sys
sys.path.append('/app/py')

import unittest
from user_manager import UserManager

class TestSignin(unittest.TestCase):
    """Test for Signin."""

    @classmethod
    def setUpClass(cls):
        """Called before everything. (setup)"""
        print("setUpClass")
        cls.user_manager = UserManager()
        cls.user = {
            'name': 'Libor',
            'surname': 'Zachoval',
            'email': 'libor.zachoval@itcarlow.ie',
            'role': 'Admin',
            'password': 'password'
        }

    @classmethod
    def tearDownClass(cls):
        """Called after everything.(clean)"""
        print("tearDownClass")
        cls.user_manager.deleteuser(cls.user)



    def setUp(self):
        """Called at the start of every test. (setup)"""
        print("setUp")

    def tearDown(self):
        """Called after every test (clean up)."""
        print("tearDown")


    def test_a_signup(self):
        """Test1 tests for True by adding the exact user into DB.
        ***Test2 tests for False by using right email but wrong fields.
        ***Test3 tests for False by using a made up email."""
        print("test_signup")

        user = self.user
        self.user_manager.signup(user)
        self.signup(user, True)

        user = {
            'name': 'L',
            'surname': 'Z',
            'email': 'libor.zachoval@itcarlow.ie',
            'role': 'A',
            'password': 'p'
        }

        self.signup(user, False)

        user = {
            'name': 'L',
            'surname': 'Z',
            'email': 'madeupemail',
            'role': 'A',
            'password': 'p'
        }

        self.signup(user, False)

    def signup(self, user, expected):
        result = self.user_manager.getuser(user)
        if (result != "USER_DOESNT_EXIST"):
            self.checkuser(user, result, expected, list(user.keys()))
        else:
            self.assertTrue(False == expected)

    def checkuser(self, user, result, expected, fields):
        testPassed = True

        for field in fields:
            if (user[field] != result[field]):
                testPassed = False
                break

        self.assertTrue(testPassed == expected)



    def test_b_singin(self):
        """."""
        print("test_singin")
        #returns enum USER_DOESNT_EXIST, DETAILS_INCORRECT, OK
        user = {"email":"jack", "password":"password123"}
        self.singin(user, "USER_DOESNT_EXIST")

        user = {"email":"libor.zachoval@itcarlow.ie","password":"wrongPassword"}
        self.singin(user, "DETAILS_INCORRECT")

        user = {"email":"libor.zachoval@itcarlow.ie","password":"password"}
        self.singin(user, "signin_successful")

    def singin(self, user, expected):
        result = self.user_manager.signin(user)
        print(result)
        self.assertTrue(result == expected)


if __name__ == '__main__':
    unittest.main()
