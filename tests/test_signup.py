import sys
sys.path.append('..\py')
#sys.path.insert(0, '/C:/Users/C00178537/Desktop/Desktop/Paid Projects/Project Organiser/py')

import unittest
from user_manager import UserManager

class TestSignup(unittest.TestCase):
    """Test for Signup."""

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



    def test_signup(self):
        """."""
        print("test_signup")
        self.assertTrue(is_prime(5))


if __name__ == '__main__':
    unittest.main()
