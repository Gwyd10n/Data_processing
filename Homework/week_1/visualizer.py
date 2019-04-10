#!/usr/bin/env python
# Name: Gwydion Oostvogel
# Student number: 12578002
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


def read_csv(path):
    """
    Reads data from input csv file and stores it in a list.
    """
    # TODO


def sort_data(data):
    """
    Sorts data yearly average rating
    """
    # TODO

def plot(data, parameters):
    """
    Plots data to graph
    """


if __name__ == "__main__":
    read_csv(INPUT_CSV)
    print(data_dict)
