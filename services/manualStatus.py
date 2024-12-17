def findHealthStatusBackup(params):
    avg_temp = params['avg_temperature']
    avg_hr = params['avg_heart_rate']
    avg_o2 = float(params['avg_oxygen_saturation'])  # Convert Decimal to float for comparisons

    # Logical Conditions for Health Status
    if avg_temp > 40.0 or avg_hr > 120 or avg_o2 < 85:
        return "Dead"  # Extreme values for temperature, heart rate, or oxygen saturation
    elif avg_temp > 39.5 or avg_hr > 110 or avg_o2 < 90:
        return "Dangerous"  # Critical but not extreme
    elif avg_temp > 39.0 or avg_hr > 100 or avg_o2 < 93:
        return "Very Bad"  # Significantly abnormal values
    elif avg_temp > 38.5 or avg_hr > 95 or avg_o2 < 95:
        return "Bad"  # Slightly abnormal values
    elif avg_temp > 37.5 or avg_hr > 90 or avg_o2 < 96:
        return "Good"  # Acceptable but not ideal
    else:
        return "Excellent"  # All parameters within ideal range
