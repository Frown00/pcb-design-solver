#  Printed Circuit Board (PCB) Design Solver
Program created as a university project to implement genetic algorithm.

The problem is to design a network of physical connections such that any two solder points are physically connected if and only if there is a planned structural connection between them. 

## Config
<img src="https://github.com/Frown00/pcb-design-solver/blob/master/assets/zad01-config.PNG?raw=true" width="350">


## Solved
<img src="https://github.com/Frown00/pcb-design-solver/blob/master/assets/zad01.PNG?raw=true" width="350">

## Preview
<img src="https://github.com/Frown00/pcb-design-solver/blob/master/assets/Animation.gif?raw=true" width="450">

## Data
Each run is saved in "results" folder as csv file with name based on used config

### Example
filename: Gen=100 Pop=1000 S=tournament R=3 CX=70 MX=50 P=100 1 1.csv

| Generation    | Best          | Average       | Worst         | Std
| ------------- |:-------------:|:-------------:|:-------------:|-------------:|
| 1      | 10177 | 22009 | 29434 | 3321 |
| 2      | 9911 | 19174 | 25834 | 2938 |
| ...     | ... | ... | ... | ... |
| 100      | 649 | 1006 | 3279| 397 |

All values are fitness.
Fitess is calculated value based on penalty multipliers
 
