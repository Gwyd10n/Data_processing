#!/usr/bin/env python
# Name: Gwydion Oostvogel
# Student number: 12578002
"""
Preprocessing data obtained from csv file.
"""

import pandas as pd
import matplotlib.pyplot as plt


def read_csv(path):
    """
    Read csv file and load data into pandas object
    :param path: string
    :return: object
    """
    column_headers = ['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)',
                      'GDP ($ per capita) dollars']
    df = pd.read_csv(path)
    return df[column_headers]


def clean_data(df):
    """
    Cleans data in data frame.
    :param df: object
    :return: object
    """
    # Clean Country and Region column.
    df['Country'] = df['Country'].str.strip()
    df['Region'] = df['Region'].str.strip()

    # Clean Pop. Density column.
    df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].str.replace(',', '.')
    df['Pop. Density (per sq. mi.)'] = pd.to_numeric(df['Pop. Density (per sq. mi.)'], errors='coerce')

    # Clean Infant mortality column.
    df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)'].str.replace(',', '.')
    df['Infant mortality (per 1000 births)'] = pd.to_numeric(df['Infant mortality (per 1000 births)'], errors='coerce')

    # Clean GDP column.
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.strip(' dollars')
    df['GDP ($ per capita) dollars'] = pd.to_numeric(df['GDP ($ per capita) dollars'], errors='coerce')

    return df


def centr_tend(df, column_name):
    """
    Prints mean, median, mode and standard deviation of column in data frame.
    :param df: object
    :param column_name: string
    :return: none
    """
    mean = df['GDP ($ per capita) dollars'].mean()
    median = df['GDP ($ per capita) dollars'].median()
    mode = df['GDP ($ per capita) dollars'].mode()[0]
    std_dev = df['GDP ($ per capita) dollars'].std()

    print(f"Column: {column_name}\nMean: {mean}\nMedian: {median}\nMode: {mode}\nStandart deviation: {std_dev}")


def plot_hist(df, column_name):
    GDP_list = [value for value in df[column_name].tolist() if value <= 50000]
    plt.hist(GDP_list, normed=True, bins=48)
    plt.show()


if __name__ == "__main__":
    data = clean_data(read_csv('input.csv'))
    centr_tend(data, 'GDP ($ per capita) dollars')
    plot_hist(data, 'GDP ($ per capita) dollars')

    # print(data)
