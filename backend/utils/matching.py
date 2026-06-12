# Matching logic for lost and found items.
# Implement functions to compare item details and suggest matches.
from backend.models.item import Item

def find_matches(lost_item, found_items):
    matches = []

    for item in found_items:
        score = score(lost_item, item)

        if score >= 70:
            matches.append({
                "item": item,
                "score": score
            })

    return sorted(matches, key=lambda x: x["score"], reverse=True)