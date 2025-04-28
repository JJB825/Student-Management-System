from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# Setup
BASE_URL = "http://localhost:5173"
SCREENSHOT_DIR = "screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

options = Options()
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 10)

def take_screenshot(name):
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    driver.save_screenshot(path)
    print(f"📸 Screenshot saved: {path}")

# Utility: Wait for toast to appear
def wait_for_toast():
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "Toastify__toast")))

# -------------------------
# Slow interaction helpers
# -------------------------

def pause(seconds=1):
    """Pause execution for visual effect."""
    time.sleep(seconds)

def slow_type(element, text, delay=0.1):
    """Types text into an input slowly, character by character."""
    for char in text:
        element.send_keys(char)
        time.sleep(delay)

def scroll_and_click(selector):
    """Scrolls to the element and clicks it."""
    try:
        btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
        driver.execute_script("arguments[0].scrollIntoView(true);", btn)
        pause(0.5)
        btn.click()
    except Exception as e:
        print(f"❌ Could not click on element: {e}")

# -------------------------------
# 1. CREATE STUDENT TEST CASE
# -------------------------------
def test_create_student(name, course, fee, mobile, screenshot_name):
    print(f"\n🧪 Creating student: {name}")
    driver.get(f"{BASE_URL}/add-student")
    time.sleep(1)

    slow_type(driver.find_element(By.NAME, "stname"), name)
    pause(0.5)
    slow_type(driver.find_element(By.NAME, "course"), course)
    pause(0.5)
    slow_type(driver.find_element(By.NAME, "fee"), fee)
    pause(0.5)
    slow_type(driver.find_element(By.NAME, "mobile"), mobile)
    pause(0.5)

    take_screenshot(f"{screenshot_name}_before_submit")

    scroll_and_click("form#add_user button[type='submit']")

    try:
        wait_for_toast()
        pause(2.5)
        take_screenshot(f"{screenshot_name}_after_submit")
    except:
        print("⚠️ Toast not found")

# -------------------------------
# 2. UPDATE STUDENT TEST CASE
# -------------------------------
def test_update_student(student_id, name, course, fee, mobile, screenshot_name):
    print(f"\n🧪 Updating student ID: {student_id}")
    driver.get(f"{BASE_URL}/update-student/{student_id}")
    time.sleep(1)

    if name:
        driver.find_element(By.NAME, "stname").clear()
        slow_type(driver.find_element(By.NAME, "stname"), name)
        pause(0.5)
    if course:
        driver.find_element(By.NAME, "course").clear()
        slow_type(driver.find_element(By.NAME, "course"), course)
        pause(0.5)
    if fee:
        driver.find_element(By.NAME, "fee").clear()
        slow_type(driver.find_element(By.NAME, "fee"), fee)
        pause(0.5)
    if mobile:
        driver.find_element(By.NAME, "mobile").clear()
        slow_type(driver.find_element(By.NAME, "mobile"), mobile)
        pause(0.5)

    take_screenshot(f"{screenshot_name}_before_submit")

    scroll_and_click("form#update_user button[type='submit']")

    try:
        wait_for_toast()
        pause(2.5)
        take_screenshot(f"{screenshot_name}_after_submit")
    except:
        print("⚠️ Toast not found")

# -------------------------------
# 3. DELETE STUDENT TEST CASE
# -------------------------------
def test_delete_first_student():
    print("\n🧪 Deleting first student in list")
    driver.get(BASE_URL)
    time.sleep(2)

    try:
        delete_btn = driver.find_element(By.XPATH, "//span[text()='Delete']/parent::a")
        take_screenshot("delete_before_click")
        delete_btn.click()
        wait_for_toast()
        take_screenshot("delete_after_click")
    except:
        print("⚠️ No student found to delete or toast not shown")

# -------------------------------
# ✅ Example Test Runs
# -------------------------------

create_student_testcases = [
    ["", "", "", "", "test_empty_create"],
    ["Alice", "IT", "2004", "efghi", "test_create_invalid_mobile"],
    ["Jishnu", "SE", "2005", "+919372180892", "test_duplicate_entry"],
    ["Kasturi", "CE", "2007", "+919876543210", "test_valid_create"],
]
for testcase in create_student_testcases:
    name, course, fee, mobile, screenshot_name = testcase
    test_create_student(name, course, fee, mobile, screenshot_name)
    time.sleep(1)

update_student_testcases = [
    ["abcde", "", "", "", "", "test_empty_update"],
    ["abcde", "jofra", "", "", "", "test_invalid_studentId_update"],
    ["6", "", "", "", "214253", "test_update_invalid_mobile"],
    ["14", "Jofra", "ML", "8500", "+918888888888", "test_valid_update"]
]
for testcase in update_student_testcases:
    student_id, name, course, fee, mobile, screenshot_name = testcase
    test_update_student(student_id, name, course, fee, mobile, screenshot_name)
    time.sleep(1)

test_delete_first_student()

# Cleanup
driver.quit()
