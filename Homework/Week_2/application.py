#!/usr/bin/env python
# Name: Gwydion Oostvogel
# Student number: 12578002
"""
Preprocessing data obtained from csv file.
"""

import pandas as pd


def read_csv(path):
    column_headers = ['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)',
                      'GDP ($ per capita) dollars']
    df = pd.read_csv(path)
    df = df[column_headers]
    df['Country'] = df['Country'].str.strip()
    df['Region'] = df['Region'].str.strip()
    

    print(df)
    print(pd.isnull(df[['GDP ($ per capita) dollars']]))


if __name__ == "__main__":
    read_csv('input.csv')
