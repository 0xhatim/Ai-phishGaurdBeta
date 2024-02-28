import socket
import ssl
from urllib.parse import urlparse
import requests
import json
import re
from fuzzywuzzy import fuzz
import spacy
import tldextract



nlp = spacy.load("en_core_web_md")

print("Done Load")
# www.sub.domain.com
def get_domain_from_link(link):
    url_without_www = link.replace("www.", "")
    parts = tldextract.extract(url_without_www)
    return parts.subdomain, parts.domain, parts.suffix
# Saudi
# Suadi

def calculate_similarity(word_list, link, keywords_weight=0.2, domain_presence_weight=0.2):
    # Extract subdomain, domain, and suffix from the link
    subdomain, domain, suffix = get_domain_from_link(link)

    # Tokenize the link and words for each domain part
    subdomain_tokens = nlp(subdomain)
    domain_tokens = nlp(domain)
    suffix_tokens = nlp(suffix)

    # Compute the cosine similarity for each domain part
    subdomain_similarity = subdomain_tokens.similarity(nlp(" ".join(word_list)))
    domain_similarity = domain_tokens.similarity(nlp(" ".join(word_list)))
    suffix_similarity = suffix_tokens.similarity(nlp(" ".join(word_list)))

    # Take the maximum similarity value among the domain parts
    max_similarity = max(subdomain_similarity, domain_similarity, suffix_similarity)

    # Adjust similarity based on additional criteria
    if any(keyword.lower() in link.lower() for keyword in word_list):
        max_similarity += keywords_weight

    if domain in word_list:
        max_similarity += domain_presence_weight

    return max_similarity


def fuzzy_string_matching(string1, string2):
    # Use fuzzywuzzy library for string matching
    return fuzz.partial_ratio(string1.lower(), string2.lower()) / 100.0
def get_page_content_with_user_agent(url, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"):
    try:
        headers = {"User-Agent": user_agent}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
    except Exception as e:
        pass
    return None

def calculate_fuzzy_similarity(word_list, domain_parts):
    # Calculate fuzzy similarity for each part of the domain
    subdomain_similarity = max(fuzzy_string_matching(part, word) for part in domain_parts['subdomain'] for word in word_list)
    domain_similarity = max(fuzzy_string_matching(part, word) for part in domain_parts['domain'] for word in word_list)
    suffix_similarity = max(fuzzy_string_matching(part, word) for part in domain_parts['suffix'] for word in word_list)

    # Return the maximum similarity value among domain parts
    return max(subdomain_similarity, domain_similarity, suffix_similarity)

results = []  # List to store the results for each domain
def check_phishing_similarity(target_url, dataset):
    parsed_url = urlparse(target_url)
    host_target = parsed_url.netloc.replace("www.", "")
    target_content = get_page_content_with_user_agent(target_url)
    if not target_content:
        print(f"Could not fetch content for {target_url}")
    target_content = ""
    for domain_dict in dataset:
        link = domain_dict['link']
        parsed_url = urlparse(link)
        domain = parsed_url.netloc.replace("www.", "")
        word_list = domain_dict['domain_keywords']
        


        domain_similarity = fuzzy_string_matching(host_target, domain)

        similarity_score = calculate_similarity(word_list, host_target)
        print(f"Domain: {domain}, Host Target: {host_target}")
        print(f"Domain Similarity Score: {domain_similarity}")

        # Fetch content with iPhone user agent


        # Keywords in English
        target_keywords_en = domain_dict['keywords_en']
        for keyword_en in target_keywords_en:
            if keyword_en.lower() in target_content.lower():
                similarity_score += 0.2

        # Keywords in Arabic
        target_keywords_ar = domain_dict['keywords_ar']
        for keyword_ar in target_keywords_ar:
            if keyword_ar in target_content:
                similarity_score += 0.2

        print(f"Final Similarity Score: {similarity_score}")
        print("---")
        results.append({
            'link': link,
            'target_url': target_url,
            'domain_similarity': domain_similarity,
            'similarity_score': similarity_score,
            "sum":domain_similarity+similarity_score
        })
    

# Example usage


json_file_path = "dataset.json"

with open(json_file_path, 'r') as file:
    dataset = json.load(file)

target_url = "https://holidaysbysaudia.com/en-US/pnrstopover?campaignid=20599075338&adgroupid=&keyword=&device=c"
check_phishing_similarity(target_url, dataset)
sorted_results = sorted(results, key=lambda x: x['sum'], reverse=True)
print(sorted_results)
output_file_path = "output.json"
with open(output_file_path, 'w') as output_file:
    json.dump(sorted_results, output_file, indent=2)

print(f"Results saved to {output_file_path}")
