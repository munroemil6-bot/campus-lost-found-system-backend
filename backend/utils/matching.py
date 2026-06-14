"""Matching logic for lost and found items.
Implement functions to compare item details and suggest matches.

This module keeps a minimal, import-friendly API so other modules can
call `find_matches` without depending on package-qualified imports.
"""
from models.item import Item


def find_matches(lost_item, found_items):
    matches = []

    for item in found_items:
        # Placeholder scoring function — keep simple to avoid circular deps
        score = _score_items(lost_item, item)

        if score >= 70:
            matches.append({
                "item": item,
                "score": score,
            })

    return sorted(matches, key=lambda x: x["score"], reverse=True)


def _score_items(a, b):
    # Simple heuristic: match on name and location substrings
    score = 0
    if not a or not b:
        return 0
    if getattr(a, "name", "").lower() and getattr(b, "name", "").lower():
        if a.name.lower() == b.name.lower():
            score += 80
        elif a.name.lower() in b.name.lower() or b.name.lower() in a.name.lower():
            score += 50
    if getattr(a, "location", "") and getattr(b, "location", ""):
        if a.location.lower() == b.location.lower():
            score += 20
    return min(score, 100)