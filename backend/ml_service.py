"""Replace this function with the separately trained model adapter later."""

def predict_support_priority(features: dict) -> dict:
    missed = features.get('missed_last_7_days', 0)
    delays = features.get('delayed_last_7_days', 0)
    score = min(100, 20 + missed * 18 + delays * 7 + features.get('consecutive_missed', 0) * 12)
    priority = 'HIGH' if score >= 70 else 'WATCH' if score >= 40 else 'NORMAL'
    return {'anomaly': score >= 70, 'anomaly_score': round(score / 100, 2), 'support_priority_score': score, 'priority': priority, 'reasons': ['Missed confirmations'] if missed else []}
