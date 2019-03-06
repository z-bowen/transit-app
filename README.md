Some comments on my choices when designing this project:

The assignment didn't strictly specify that I needed to build a database, but I figured that's a major component of backend engineering, and you'd want to see it. Also, while the code base for the project could be reduced by simply reading the .csv files directly, it wouldn't be remotely scalable. I hope this was the correct intent for the project.

I needed to do a bit of data sanitization to get the .csv data into the db. Specifically, I wanted to store the timestamps as Date objects so that I could do a nice sort when trying to find the next vehicle at a stop. String sorting fails, as it gives 9:00:00 > 10:00:00, and the times provided didn't have leading 0s.

I made the choice to store everything in the DB as a clock time on 1.1.1970, rather than do the string manipulation to add leading 0s. In either case, in a production DB, I'd push to have the time data include dates, since transit data changes with the days of the week (usually).

Please let me know if you have any questions or comments.

Best,

-Zach