# codechef_scraper.py
import requests
from bs4 import BeautifulSoup
import re
import json
import sys

def scrape_codechef_user(username):
    url = f"https://www.codechef.com/users/{username}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return json.dumps({"error": "Failed to fetch"})

    soup = BeautifulSoup(response.text, "html.parser")
    profile_data = {}

    name_tag = soup.find("header", class_="user-details-header")
    if name_tag:
        profile_data["name"] = name_tag.find("h2").get_text(strip=True)

    rating_tag = soup.find("div", class_="rating-number")
    if rating_tag:
        profile_data["rating"] = rating_tag.text.strip()

    stars_tag = soup.find("span", class_="rating-star")
    if stars_tag:
        profile_data["stars"] = stars_tag.text.strip()

    country_tag = soup.find("span", class_="user-country-name")
    if country_tag:
        profile_data["country"] = country_tag.text.strip()

    problems_solved = soup.find("section", class_="rating-data-section problems-solved")
    if problems_solved:
        text = problems_solved.get_text(strip=True)
        match = re.search(r'Total Problems Solved:\s*(\d+)', text)
        if match:
            profile_data["total_problems_solved"] = int(match.group(1))
        else:
            profile_data["total_problems_solved"] = 0

    print(json.dumps(profile_data))

if __name__ == "__main__":
    username = sys.argv[1]
    scrape_codechef_user(username)
