# NASA GISS Surface Temperature Analysis (GISTEMP)

## Overview

This project is an assignment as part of the [Data Visualization course](https://class.coursera.org/datavisualization-001). It aims to explore the NASA data set and to get 
hands-on experience with the topics that are covered in the course.

[![nl-hugo.github.io/gistemp](/media/screenshot.png)](http://nl-hugo.github.io/gistemp)

This chart visualizes NASA's GISTEMP data. It shows temperatures in regions between the earth's circles of latitude over the period from 1880 until 2014. 

I chose to visualize the data according to the 'small multiples' principle, whereby each region is displayed as a separate line chart. The regions are ordered from North (top) to South (bottom), thus representing their actual location on a globe. The temperatures are indexed to 1880's value(1880 = 0 degrees celcius) to make it easier to discover trends within regions. Also, with all multiples having the same scale, regions can be easily compared with each other. I used a greyish color as base color for the chart as to create a neutral canvas with sufficient contrast. Axis labels are slightly lighter, so that they do not draw away the user's attention of the actual data. Finally, the regions with the highest deviation are colored in purple, so that, besides their distinctive shape, they stand out from the others.


## Source Code Layout

    css\                CSS stylesheets
    data\               visualization data
    js\                 JavaScript files for the visualization and the website
    media\				media files
    index.html          landing page
	LICENSE				The license file
    README.md           README file that appears on the website's github page
	
	
## Raw Data

The data set was downloaded as [zip-file](https://d396qusza40orc.cloudfront.net/datavisualization/programming_assignment_1/Programming%20Assignment%201%20Data%20New.zip) from the 
course website. It is adapted from the data set at NASA's [GISTEMP website](http://data.giss.nasa.gov/gistemp/).

The data set contains global temperatures from 1880 until 2014.


## Data Cleaning 

The data set was already preprocessed by the course instructor. No additional cleaning was necessary.


