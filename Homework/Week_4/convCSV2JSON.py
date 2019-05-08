import pandas as pd
import json
import sys

def conv_json(infile):
    df_raw = pd.read_csv(infile+'.csv')
    df_raw.columns = [c.lower().replace(' ', '_') for c in df_raw.columns]
    df = df_raw[['location', 'time', 'value']].copy()
    df = df.dropna(axis=0, how='any', inplace=False)
    df.to_json(infile+".json", orient="index")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: incorrect number of arguments\nUsage: Python convertCSV2JSON.py name infile")
        sys.exit(1)
    conv_json(sys.argv[1])
