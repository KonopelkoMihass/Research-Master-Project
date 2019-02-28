# import sys
# sys.path.append('/app/py')

import unittest
import os
import time

# http://chromedriver.chromium.org/downloads
# https://selenium-python.readthedocs.io/locating-elements.html
# https://selenium-python.readthedocs.io/api.html
# http://www.teachmeselenium.com/2018/04/17/python-selenium-actionchains-performing-drag-and-drop-operations/
# good idea for reimplementing methods - by Chirag verma:
# https://stackoverflow.com/questions/35677563/python-selenium-click-an-element-if-visible/35677593
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select

class TestBot(unittest.TestCase):
	"""Test bot to run through all of the features"""

	@classmethod
	def setUpClass(cls):
		"""Called before everything. (setup)"""
		print("setUpClass")
		# cls.log_manager = LogManager("test_logger", "test_log.txt")
		# cls.user_manager = UserManager(cls.log_manager)

		cls.IDS = {
			"SIGNIN_VIEW": "signin",
			"SIGNIN_EMAIL": "signin-email",
			"SIGNIN_PASSWORD": "signin-password",
			"SIGNIN_BUTTON": "signin-button",

			"SIGNIN_VIEW": "signup",
			"SIGNUP_LINK": "signup-link",
			"SIGNUP_EMAIL": "signup-email",
			"SIGNUP_NAME": "signup-name",
			"SIGNUP_SURNAME": "signup-surname",
			"SIGNUP_NOUN": "signup-noun",
			"SIGNUP_GROUP_SELECTOR": "signup-group",
			"SIGNUP_GROUP_SELECT_Y1A": "y1a",
			"SIGNUP_GROUP_SELECT_Y1B": "y1b",
			"SIGNUP_GROUP_SELECT_Y2": "y2",
			"SIGNUP_GROUP_SELECT_Y3": "y3",
			"SIGNUP_GROUP_SELECT_Y4": "y4",
			"SIGNUP_GROUP_SELECT_OTHER": "other",
			"SIGNUP_PASSWORD": "signup-password",
			"SIGNUP_CONFIRM_PASSWORD": "signup-confirm-password",
			"SIGNUP_BUTTON": "signup-button",

			"MENU_PANEL_STUDENT": "menupanel-student"
		}



		cls.user = {
			'name': 'test1y1aq',
			'surname': 'test1y1aq',
			'email': 'test1y1aq@itcarlow.ie',
			'noun': 'grezzo',
			'password': 'password11',
			'group': 'y1a'
		}

		cls.driver = webdriver.Chrome()
		cls.driver.get("http://192.168.99.100:8002")
		cls.driver.maximize_window()
		WebDriverWait(cls.driver, 5)

	@classmethod
	def tearDownClass(cls):
		"""Called after everything.(clean)"""
		print("tearDownClass")
		# cls.user_manager.delete_user(cls.user)
		# cls.log_manager.logdebug("Tear Down Class Finished")

		cls.driver.quit()


	def tearDown(self):
		"""Called after every test (clean up)."""
		print("tearDown")


	def test_flow(self):
		print("Test path starting.")
		# sign up and sign in
		self.sign_up()
		#self.sign_in()
		input('Press ENTER to exit')



	def sign_up(self):
		print("sign_up")

		self.view_test_by_id(self.IDS["SIGNUP_LINK"])
		self.driver.find_element_by_id(self.IDS["SIGNUP_LINK"]).click()
		self.view_test_by_id(self.IDS["SIGNUP_NAME"])

		self.fill_text_box(self.IDS["SIGNUP_NAME"], self.user["name"])
		self.fill_text_box(self.IDS["SIGNUP_SURNAME"], self.user["surname"])
		self.fill_text_box(self.IDS["SIGNUP_EMAIL"], self.user["email"])
		self.fill_text_box(self.IDS["SIGNUP_NOUN"], self.user["noun"])
		self.click_option(self.IDS["SIGNUP_GROUP_SELECTOR"], self.user["group"])

		self.fill_text_box(self.IDS["SIGNUP_PASSWORD"], self.user["password"])
		self.fill_text_box(self.IDS["SIGNUP_CONFIRM_PASSWORD"], self.user["password"])

		self.click_element(self.IDS["SIGNUP_BUTTON"], 5)

		self.view_test_by_id(self.IDS["MENU_PANEL_STUDENT"])


	def sign_in(self):
		print("sign_in")

		self.view_test_by_id(self.IDS["SIGNIN_VIEW"])

		self.fill_text_box(self.IDS["SIGNIN_EMAIL"], self.user["email"])
		self.fill_text_box(self.IDS["SIGNIN_PASSWORD"], self.user["password"])

		self.click_element(self.IDS["SIGNIN_BUTTON"], 5)

		self.view_test_by_id(self.IDS["PROJECTS_BOX"])







	def go_to_sign_in(self):
		self.view_test_by_id(self.IDS["SIGNUP_VIEW"])
		self.driver.find_element_by_id(self.IDS["SIGNUP_LINK"]).click()
		self.view_test_by_id(self.IDS["SIGNIN_BOX"])



	def view_test_by_id(self, id):
		element = self.get_element_via_id(id)
		self.assertEqual(id, element.get_attribute("id"), "given ids do not match. '%s' != '%s'" % (
		id, element.get_attribute("id")))

		self.visibility_test_by_id(id, True)


	def visibility_test_by_id(self, id, visible):
		try:
			if visible:
				WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, id)))
			else:
				WebDriverWait(self.driver, 10).until(EC.invisibility_of_element_located((By.ID, id)))
		except TimeoutException:
			self.assertTrue(False, "Failed to locate a visible - '%s' element under id '%s'" % (visible, id))






	def click_element(self, id, wait_time):
		if isinstance(id, str):
			element = self.get_element_via_id(id)
		else:
			element = id

		attribute_id = element.get_attribute("id")

		if attribute_id != "":
			if element.is_displayed():
				pass
			else:
				self.visibility_test_by_id(attribute_id, True)
			print("Id: %s" % attribute_id)
		else:
			attribute_class_name = element.get_attribute("class")

			if attribute_class_name != "":
				print("class name: %s" % attribute_class_name)

		element.click()

		# wait for seconds
		self.driver.implicitly_wait(wait_time)
		time.sleep(wait_time)


	def click_option(self, id, value):
		select = Select(self.driver.find_element_by_id(id))

		# select by visible text
		# select.select_by_visible_text(str(value))

		# select by value
		select.select_by_value(str(value))



	def fill_text_box(self, id, text):
		if isinstance(id, str):
			element = self.get_element_via_id(id)
		else:
			element = id

		element.click()
		# a weird bug with 'clear()' on any text box
		# so this is a work around...
		ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('a').key_up(Keys.CONTROL).perform()
		ActionChains(self.driver).send_keys(Keys.BACKSPACE).perform()
		print(text)
		element.send_keys(text)



	def get_element_via_id(self, id):
		try:
			element = WebDriverWait(self.driver, 10).until(lambda driver: self.driver.find_element_by_id(id))
		except TimeoutException:
			self.assertTrue(False, "Failed to locate element under id: " + id)
		return element



if __name__ == '__main__':
    unittest.main()





