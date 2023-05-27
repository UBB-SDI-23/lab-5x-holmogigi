import matplotlib
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.style as style

matplotlib.use('TkAgg')

style.use('dark_background')

df = pd.read_csv('cpu_usage_log_2.csv', header=None, names=['Timestamp', 'CPU Usage'])

df['Timestamp'] = pd.to_datetime(df['Timestamp'], format='%m/%d/%Y %H:%M:%S.%f')

df['Elapsed Time'] = (df['Timestamp'] - df['Timestamp'].min()).dt.total_seconds()

plt.plot(df['Elapsed Time'], df['CPU Usage'], color='purple')

plt.xlabel('Elapsed Time (seconds)')
plt.ylabel('CPU Usage (%)')
plt.title('CPU Usage Over Time at 2 USERS')

plt.ylim(0, 100)
plt.yticks(range(0, 101, 10))

plt.tight_layout()
plt.show()
