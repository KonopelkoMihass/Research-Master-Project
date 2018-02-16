import sys
sys.path.append('..\py')

import unittest
from user_manager import UserManager

class TestSignin(unittest.TestCase):
    """Test for Signin."""

    @classmethod
    def setUpClass(cls):
        """Called before everything. (setup)"""
        print("setUpClass")



    @classmethod
    def tearDownClass(cls):
        """Called after everything.(clean)"""
        print("tearDownClass")



    def setUp(self):
        """Called at the start of every test. (setup)"""
        print("setUp")



    def tearDown(self):
        """Called after every test (clean up)."""
        print("tearDown")



    def test_singin(self):
        """."""
        print("test_singin")
        #returns enum USER_DOESNT_EXIST, DETAILS_INCORRECT, OK
        result = user_manager.signin("jack","password123")
        self.assertTrue(result)

        result = user_manager.signin("jack","password123")
        self.assertTrue(result)


if __name__ == '__main__':
    unittest.main()
