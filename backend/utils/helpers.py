# General helper utilities for backend logic.
# Implement reusable helpers such as normalization and validation.
def match_score(lost_item, found_item):
    score = 0

    if lost_item.name.lower() == found_item.name.lower():
        score += 50

    if lost_item.category == found_item.category:
        score += 30

    if lost_item.location == found_item.location:
        score += 20

    return score