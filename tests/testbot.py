import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


class TestBot(unittest.TestCase):
    """Test bot to run through all of the features"""

    @classmethod
    def setUpClass(cls):
        """Called before everything. (setup)"""
        print("setUpClass")
        cls.name = "Libor"
        cls.surname = "Zachoval"
        cls.role = "Admin"
        cls.email = "libor.zachoval@itcarlow.ie"
        cls.password = "password"

        cls.driver = webdriver.Chrome()
        cls.driver.get("http://localhost/ProjectOrganiser/")
        cls.driver.maximize_window()


    @classmethod
    def tearDownClass(cls):
        """Called after everything.(clean)"""
        print("tearDownClass")
        cls.driver.quit()


    def setUp(self):
        """Called at the start of every test. (setup)"""
        print("setUp")


    def tearDown(self):
        """Called after every test (clean up)."""
        print("tearDown")


    def test_a_signup(self):
        print("test_signup")
        driver = self.driver

        SIGNIN_BOX_ID = "signin-box"
        SIGNUP_BOX_ID = "signup-box"
        SIGNUP_LINK_ID = "signup-link"

        SIGNUP_NAME_ID = "signup-name"
        SIGNUP_SURNAME_ID = "signup-surname"
        SIGNUP_ROLE_ID = "signup-role"
        SIGNUP_EMAIL_ID = "signup-email"
        SIGNUP_PASSWORD_ID = "signup-password"
        SIGNUP_BUTTON_ID = "signup-button"


        boxElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_class_name(SIGNIN_BOX_ID))
        self.assertEqual(SIGNIN_BOX_ID, boxElement.get_attribute("class"))

        driver.find_element_by_id(SIGNUP_LINK_ID).click()

        boxElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_class_name(SIGNUP_BOX_ID))
        self.assertEqual(SIGNUP_BOX_ID, boxElement.get_attribute("class"))


        signupNameElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNUP_NAME_ID))
        signupSurnameElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNUP_SURNAME_ID))
        #find_element_by_xpath("//select[@id='" + SIGNUP_ROLE_ID + "']/option[text()='"self.role"']").click()
        signupRoleElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNUP_ROLE_ID))
        signupEmailElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNUP_EMAIL_ID))
        signupPasswordElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNUP_PASSWORD_ID))

        signupNameElement.send_keys(self.name)
        signupSurnameElement.send_keys(self.surname)
        signupRoleElement.send_keys(self.role)
        signupEmailElement.send_keys(self.email)
        signupPasswordElement.send_keys(self.password)

        driver.find_element_by_id(SIGNUP_BUTTON_ID).click()

        boxElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_class_name(SIGNIN_BOX_ID))
        self.assertEqual(SIGNIN_BOX_ID, boxElement.get_attribute("class"))


    def test_b_signin(self):
        print("test_signin")
        driver = self.driver

        SIGNIN_BOX_ID = "signin-box"
        MARK_LAB_ID = "marklab"
        SIGNIN_EMAIL_ID = "signin-email"
        SIGNIN_PASSWORD_ID = "signin-password"
        SIGNIN_BUTTON_ID = "signin-button"


        boxElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_class_name(SIGNIN_BOX_ID))
        self.assertEqual(SIGNIN_BOX_ID, boxElement.get_attribute("class"))


        signinEmailElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNIN_EMAIL_ID))
        signinPasswordElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(SIGNIN_PASSWORD_ID))

        signinEmailElement.clear()
        signinPasswordElement.clear()

        signinEmailElement.send_keys(self.email)
        signinPasswordElement.send_keys(self.password)

        driver.find_element_by_id(SIGNIN_BUTTON_ID).click()

        #Needs to be updated once marklab changes
        boxElement = WebDriverWait(driver, 10).until(lambda driver: driver.find_element_by_id(MARK_LAB_ID))
        self.assertEqual(MARK_LAB_ID, boxElement.get_attribute("id"))


if __name__ == '__main__':
    unittest.main()
