#!/usr/bin/env python
# Name: Gwydion Oostvogel
# Student number: 12578002
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import sys

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


def read_csv(path):
    """
    Reads data from input csv file and returns it in a list.
    """
    movies_arr = []
    with open(INPUT_CSV, newline='') as movies_csv:
        movies = csv.reader(movies_csv, delimiter=',')
        for movie in movies:
            if movie[2] == 'Year':
                continue
            movies_arr.append(movie)

    return movies_arr


def sort_data(movies_arr):
    """
    Sorts ratings, stores them in data_dict.
    """
    for movie in movies_arr:
        data_dict[movie[2]].append(float(movie[1]))


def calc_mean():
    """
    Calculates the mean of the values in data_dict.
    """
    keys = sorted(data_dict)
    average_ratings = []

    # Calculate mean for all years
    for year in keys:
        ratings = data_dict[year]
        average = sum(ratings) / len(ratings)
        average_ratings.append(round(average, 1))

    # Check if output is correct
    if len(average_ratings) == len(keys):
        return [list(map(int, keys)), average_ratings]
    else:
        sys.exit("Datasets don't match")


def plot(data):
    """
    Plot data on graph
    """
    plt.plot(data[0], data[1])
    plt.axis([2007.5, 2017.5, 0, 10])
    plt.ylabel('Rating')
    plt.xlabel('Year')
    plt.show()


if __name__ == "__main__":
    movies_arr = read_csv(INPUT_CSV)
    sort_data(movies_arr)
    data = calc_mean()
    plot(data)
