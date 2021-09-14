

function addCol() {
	for(let i = 0; i < document.getElementById('Kakuro').rows.length; i++){
		let row = document.getElementById('Kakuro').rows[i];
		let x = row.insertCell(-1);
		x.innerHTML = '<input style = "height:45px;width:45px;text-align:center">';
		x.style="height:50px;width:50px;text-align:center";
	}
}

function addRow() {
	let table = document.getElementById("Kakuro");
	let row = table.insertRow(-1);
	for(let i = 0; i < document.getElementById('Kakuro').rows[0].cells.length; i++){
		let x = row.insertCell(-1);
		x.innerHTML = '<input style = "height:45px;width:45px;text-align:center">';
		x.style="height:50px;width:50px;text-align:center";
	}
}

function clearTable() {
	for(let i = 0; i < document.getElementById('Kakuro').rows.length; i++){
		let row = document.getElementById('Kakuro').rows[i];
		for(let j = 0; j < row.cells.length; j++){
			row.cells[j].innerHTML = '<input style = "height:45px;width:45px;text-align:center">';
		}
	}
}

function removeRow() {
	if(document.getElementById('Kakuro').rows.length > 1)
		document.getElementById('Kakuro').deleteRow(document.getElementById('Kakuro').rows.length - 1);
}

function removeCol() {
	for(let i = 0; i < document.getElementById('Kakuro').rows.length; i++){
		let row = document.getElementById('Kakuro').rows[i];
		if(row.cells.length > 1){
			row.deleteCell(row.cells.length - 1);
		}
	}
}

function Solve(){

	let AllOptions = [];
	
	ArrayOfNumbers = [];
	ArrayOfSums = [];

	let Knowns = [];
	
	height = document.getElementById("Kakuro").rows.length;
	width = document.getElementById('Kakuro').rows[0].cells.length;
	
	Tab = [];
	
	for(let i = 0; i < height; i++){
		let Row = [];
		for(let j = 0; j < width; j++){
			let value = document.getElementById('Kakuro').rows[i].cells[j].children[0].value;
			let valueWithouyspaces = "";
			for(let k = 0; k < value.length; k++){
				if(value[k] != ' '){
					valueWithouyspaces += value[k];
				}
			}
			value = valueWithouyspaces;
			if(value.includes("\\")){
				let data = {Down: undefined, Right: undefined};
				let Sperator = false;
				let s = "";
				for(let k = 0; k < value.length; k++){
					if(value[k] == '\\'){
						if(s.length != 0)
							data.Down = parseInt(s);
							s = "";
						Sperator = true;
					}
					else{
						s += value[k];
					}
				}
				
				if(s.length != 0)
					data.Right = parseInt(s);
					
				Row.push(data);
				ArrayOfSums.push({i,j});
			}
			else if(value.length == 0){
				Row.push('0');
				ArrayOfNumbers.push({i,j});
			}
			else{
				if(value[0] == 'X' || value[0] == 'x'){
					Row.push(-1);
				}
				else{
					Row.push({Known: parseInt(value[0])});
					Knowns.push({i,j});
					ArrayOfNumbers.push({i,j});
				}
			}
		}
		Tab.push(Row);
	}

	//Put in Tab all the options to the right sums
	for(let a = 0; a < ArrayOfSums.length; a++){
		let i = ArrayOfSums[a].i;
		let j = ArrayOfSums[a].j;
		if(Tab[i][j].Right != undefined){
			let Sum = Tab[i][j].Right;
			let NumberOfCellsAndAlreadySum = GetNumberOfCellsAndAlreadySum(Tab, i, j + 1,"RIGHT");

			let NumberOfCells = NumberOfCellsAndAlreadySum[0];
			Sum = Sum - NumberOfCellsAndAlreadySum[1];

			let Options = [];
				
			if(AllOptions[Sum] != undefined &&
			AllOptions[Sum][NumberOfCells] != undefined){
				Options = AllOptions[Sum][NumberOfCells];
			}
			else{
				Options = GetOptions([], [], Sum, NumberOfCells);

				if(AllOptions[Sum] == undefined){
					AllOptions[Sum] = [];
					AllOptions[Sum][NumberOfCells] = Options;
				}
				else{
					AllOptions[Sum][NumberOfCells] = Options;
				}
			}
			j++;
			let IndexInOptions = 0;
			while(j < width && Tab[i][j] != -1 && Tab[i][j].Right == undefined && Tab[i][j].Down == undefined){

				if(Tab[i][j] == '0'){
					let OptionsToThisCell = [];

					for(let k = 0; k < Options.length; k++){
						OptionsToThisCell.push(Options[k][IndexInOptions]);
					}

					Tab[i][j] = OptionsToThisCell;
					IndexInOptions++;
				}
				j++;
			}
			j--;
		}
	}

	//Combine in Tab all the options to the down sums with the options from the right sums
	for(let a = 0; a < ArrayOfSums.length; a++){
		let i = ArrayOfSums[a].i;
		let j = ArrayOfSums[a].j;
		if(Tab[i][j].Down != undefined){
			let Sum = Tab[i][j].Down;
			let NumberOfCellsAndAlreadySum = GetNumberOfCellsAndAlreadySum(Tab, i + 1, j,"Down");
				
			let NumberOfCells = NumberOfCellsAndAlreadySum[0];
			Sum = Sum - NumberOfCellsAndAlreadySum[1];

			let Options = [];
				
			if(AllOptions[Sum] != undefined &&
			AllOptions[Sum][NumberOfCells] != undefined){
				Options = AllOptions[Sum][NumberOfCells];
			}
			else{
				Options = GetOptions([], [], Sum, NumberOfCells);
					
				if(AllOptions[Sum] == undefined){
					AllOptions[Sum] = [];
					AllOptions[Sum][NumberOfCells] = Options;
				}
				else{
					AllOptions[Sum][NumberOfCells] = Options;
				}
			}
				
			i++;
			let IndexInOptions = 0;
			while(i < height && Tab[i][j] != -1 && Tab[i][j].Down == undefined
			&& Tab[i][j].Right == undefined){
				if(Tab[i][j].Known == undefined){
					
					let OptionsToThisCell = [];

					for(let k = 0; k < Options.length; k++){
						OptionsToThisCell.push(Options[k][IndexInOptions]);
					}
						
					if(Tab[i][j] == '0'){
						Tab[i][j] = OptionsToThisCell;
					}
					else{

						for(let k = Tab[i][j].length - 1; k > -1; k--){
							let check = false;
							for(let z = 0; z < OptionsToThisCell.length; z++){
								if(Tab[i][j][k] == OptionsToThisCell[z]){
									check = true;
									break;
								}
							}
							if(!check){
								let SavedJ = j;
								while(SavedJ < width && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined
								&& Tab[i][SavedJ].Right == undefined){
									if(Tab[i][SavedJ].Known == undefined)
										Tab[i][SavedJ].splice(k,1);
									SavedJ++;
								}

								SavedJ = j - 1;
								while(SavedJ > -1 && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined
								&& Tab[i][SavedJ].Right == undefined){
									if(Tab[i][SavedJ].Known == undefined)
										Tab[i][SavedJ].splice(k,1);
									SavedJ--;
								}
							}
						}
						IndexInOptions++;
					}
				}
				i++;
			}
			i--;
		}
	}

	for(let i = 0; i < Knowns.length; i++){
		Tab[Knowns[i].i][Knowns[i].j] = [Tab[Knowns[i].i][Knowns[i].j].Known];
	}

	let DidSomeThing = true;

	while(DidSomeThing){
	

		DidSomeThing = false;

		for(let a = 0; a < ArrayOfNumbers.length; a++){
			let i = ArrayOfNumbers[a].i;
			let j = ArrayOfNumbers[a].j;
			//Same digits guess in cell so the cell must be the digit
			if(Tab[i][j].length > 1){
				let SameDigit = true;
				let Dig = Tab[i][j][0];

				for(let z = 1; z < Tab[i][j].length; z++){
					if(Tab[i][j][z] != Dig){
						SameDigit = false;
						break;
					}
				}

				if(SameDigit){
					Tab[i][j] = [Dig];
					document.getElementById('Kakuro').rows[i].cells[j].children[0].value = Tab[i][j][0];
					document.getElementById('Kakuro').rows[i].cells[j].children[0].style.color = "green";
					DidSomeThing = true;
				}
				//If just this cell in the row or the column has more than one option
				else{
					if(AllRowIsOneExceptThisCell(Tab, i, j)){
						Tab[i][j] = [GetValueOfTheCellRow(Tab, i, j)];
						document.getElementById('Kakuro').rows[i].cells[j].children[0].value = Tab[i][j][0];
						document.getElementById('Kakuro').rows[i].cells[j].children[0].style.color = "green";
						DidSomeThing = true;
					}
					else if(AllColIsOneExceptThisCell(Tab, i, j)){
						let Value = [GetValueOfTheCellCol(Tab, i, j)];
						for(let z = Tab[i][j].length - 1; z > -1; z--){
							if(Tab[i][j][z] != Value){
								Tab[i][j].splice(z,1);
								DidSomeThing = true;
								//Right
								let savedj = j + 1;
								while(savedj < width && Tab[i][savedj] != -1 && Tab[i][savedj].Down == undefined && Tab[i][savedj].Right == undefined){
									if(Tab[i][savedj].length > 1){
										Tab[i][savedj].splice(z,1);
									}
									savedj++;
								}
								//Left
								savedj = j - 1;
								while(savedj > -1 && Tab[i][savedj] != -1 && Tab[i][savedj].Down == undefined && Tab[i][savedj].Right == undefined){
									if(Tab[i][savedj].length > 1){
										Tab[i][savedj].splice(z,1);
									}
									savedj--;
								}
							}
						}
					}
				}
			}
			//Just one same digit in row or column
			if(Tab[i][j].length == 1){
				let Digit =  Tab[i][j][0];
						
				let check = false;
				for(let k = 0; k < Knowns.length; k++){
					if(Knowns[k].i == i && Knowns[k].j == j){
						check = true;
						break;
					}
				}
				if(!check){
					document.getElementById('Kakuro').rows[i].cells[j].children[0].value = Tab[i][j][0];
					document.getElementById('Kakuro').rows[i].cells[j].children[0].style.color = "green";
				}
				let SavedI = i;
				//Up
				SavedI = i - 1;
				while(SavedI > -1 && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
					for(let z = Tab[SavedI][j].length - 1; z > -1; z--){
						if(Tab[SavedI][j][z] == Digit){
							Tab[SavedI][j].splice(z,1);
							DidSomeThing = true;
							//Right
							let savedj = j + 1;
							while(savedj < width && Tab[SavedI][savedj] != -1 && Tab[SavedI][savedj].Down == undefined && Tab[SavedI][savedj].Right == undefined){
								if(Tab[SavedI][savedj].length > 1){
									Tab[SavedI][savedj].splice(z,1);
								}
								savedj++;
							}
							//Left
							savedj = j - 1;
							while(savedj > -1 && Tab[SavedI][savedj] != -1 && Tab[SavedI][savedj].Down == undefined && Tab[SavedI][savedj].Right == undefined){
								if(Tab[SavedI][savedj].length > 1){
									Tab[SavedI][savedj].splice(z,1);
								}
								savedj--;
							}
						}
					}
					SavedI--;
				}
				//Down
				SavedI = i + 1;
				while(SavedI < height && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
					for(let z = Tab[SavedI][j].length - 1; z > -1; z--){
						if(Tab[SavedI][j][z] == Digit){
							Tab[SavedI][j].splice(z,1);
							DidSomeThing = true;
							//Right
							let savedj = j + 1;
							while(savedj < width && Tab[SavedI][savedj] != -1 && Tab[SavedI][savedj].Down == undefined && Tab[SavedI][savedj].Right == undefined){
								if(Tab[SavedI][savedj].length > 1){
									Tab[SavedI][savedj].splice(z,1);
								}
								savedj++;
							}
							//Left
							savedj = j - 1;
							while(savedj > -1 && Tab[SavedI][savedj] != -1 && Tab[SavedI][savedj].Down == undefined && Tab[SavedI][savedj].Right == undefined){
								if(Tab[SavedI][savedj].length > 1){
									Tab[SavedI][savedj].splice(z,1);
								}
								savedj--;
							}
						}
					}
					SavedI++;
				}
			}
		}
	}
	
	Finish = [];
	
	for(let a = 0; a < ArrayOfNumbers.length; a++){
		let i = ArrayOfNumbers[a].i;
		let j = ArrayOfNumbers[a].j;
		if(Tab[i][j].length == 1)
			Finish.push({i,j});
	}

	if(KakuroIncomplete(Tab))
		BruteForce(Tab, 0);
		
		
	for(let a = 0; a < ArrayOfNumbers.length; a++){
		let i = ArrayOfNumbers[a].i;
		let j = ArrayOfNumbers[a].j;
		if(Tab[i][j].length == 1){
			let check = false;
			for(let k = 0; k < Knowns.length; k++){
				if(Knowns[k].i == i && Knowns[k].j == j){
					check = true;
					break;
				}
			}
			if(!check){
				document.getElementById('Kakuro').rows[i].cells[j].children[0].value = Tab[i][j][0];
				document.getElementById('Kakuro').rows[i].cells[j].children[0].style.color = "green";
			}
		}
	}
	
}


function GetOptions(Options, CurrOption, Sum, NumberOfCells){

    if(Sum == 0 && CurrOption.length == NumberOfCells){
        return CurrOption;
    }
    else if(CurrOption.length == NumberOfCells){
        return [];
    }

    let SavedCurrOption = [];

    let HashTab = [];

    for(let i = 0; i < CurrOption.length; i++){
        SavedCurrOption.push(CurrOption[i]);
        HashTab[CurrOption[i]] = 1;
    }
    
    for(let i = 1; i <= 9; i++){
        if(HashTab[i] == undefined && Sum - i >= 0){
            CurrOption.push(i);
            CurrOption = GetOptions(Options, CurrOption, Sum - i, NumberOfCells).slice();
            if(CurrOption.length == NumberOfCells){
                Options.push(CurrOption);
            }

            CurrOption = SavedCurrOption.slice();
        }
    }

    if(CurrOption.length == 0){
        return Options;
    }
    
    return CurrOption;
}

function GetNumberOfCellsAndAlreadySum(Tab, i, j, Dir){

    let Mone = 0;

    let sum = 0;

    if(Dir == "RIGHT"){
        while(j < width){
            if(Tab[i][j] != -1 && Tab[i][j].Down == undefined && Tab[i][j].Right == undefined){
                if(Tab[i][j] == '0')
                    Mone++;
                else
                    sum += Tab[i][j].Known;
                
            }
            else{
                break;
            }
            j++;
        }
    }
    else{
        while(i < height){
            if(Tab[i][j] != -1 && Tab[i][j].Down == undefined && Tab[i][j].Right == undefined){
                if(Tab[i][j].Known == undefined)
                    Mone++;
                else
                    sum += Tab[i][j].Known;
            }
            else{
                break;
            }
            i++;
        }
    }

    return [Mone,sum];

}

function KakuroIncomplete(Tab){

    for(let i = 0; i < Tab.length; i++){
        for(let j = 0; j < Tab[i].length; j++){
            if(Tab[i][j] != -1 && Tab[i][j].Down == undefined && Tab[i][j].Right == undefined
             && Tab[i][j].length > 1){
                return true;
            }
        }
    }

    return false;

}

function AllRowIsOneExceptThisCell(Tab, i, j){

    let SavedJ = j + 1;
	
	let CheckHaveRight = false;

    while(SavedJ < width && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined && Tab[i][SavedJ].Right == undefined){
        if(Tab[i][SavedJ].length != 1){
            return false;
        }
        SavedJ++;
		if(SavedJ < width && Tab[i][SavedJ].Right != undefined)
			CheckHaveRight = true;
    }

    SavedJ = j - 1;
    while(SavedJ > -1 && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined && Tab[i][SavedJ].Right == undefined){
        if(Tab[i][SavedJ].length != 1){
            return false;
        }
        SavedJ--;
		if(SavedJ > -1 && Tab[i][SavedJ].Right != undefined)
			CheckHaveRight = true;
    }

    return CheckHaveRight;

}

function GetValueOfTheCellRow(Tab, i, j){

    let SavedJ = j + 1;

    let sum = 0;

    while(SavedJ < width && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined && Tab[i][SavedJ].Right == undefined){
        sum += Tab[i][SavedJ][0];
        SavedJ++;
    }

    SavedJ = j - 1;
    while(SavedJ > -1 && Tab[i][SavedJ] != -1 && Tab[i][SavedJ].Down == undefined && Tab[i][SavedJ].Right == undefined){
        sum += Tab[i][SavedJ][0];
        SavedJ--;
    }

    return Tab[i][SavedJ].Right - sum;

}

function AllColIsOneExceptThisCell(Tab, i, j){

    let SavedI = i + 1;
	
	let CheckHaveDown = false;

    while(SavedI < height && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
        if(Tab[SavedI][j].length != 1){
            return false;
        }
        SavedI++;
		if(SavedI < height && Tab[SavedI][j].Down != undefined){
			CheckHaveDown = true;
		}
    }

    SavedI = i - 1;
    while(SavedI > -1 && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
        if(Tab[SavedI][j].length != 1){
            return false;
        }
        SavedI--;
		if(SavedI > -1 && Tab[SavedI][j].Down != undefined){
			CheckHaveDown = true;
		}
    }

    return CheckHaveDown;

}

function GetValueOfTheCellCol(Tab, i, j){

    let SavedI = i + 1;

    let sum = 0;

    while(SavedI < height && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
        sum +=Tab[SavedI][j][0];
        SavedI++;
    }

    SavedI = i - 1;
    while(SavedI > -1 && Tab[SavedI][j] != -1 && Tab[SavedI][j].Down == undefined && Tab[SavedI][j].Right == undefined){
        sum += Tab[SavedI][j][0];
        SavedI--;
    }

    return Tab[SavedI][j].Down - sum;
}

function BruteForce(BruteForceTab, level){

    if(KakuroIncomplete(BruteForceTab)){
        for(let a = 0; a < ArrayOfNumbers.length; a++){
			let i = ArrayOfNumbers[a].i;
			let j = ArrayOfNumbers[a].j;
            if(BruteForceTab[i][j].length > 1){
                for(let z = 0; z < BruteForceTab[i][j].length; z++){
					
                    let TempTab = [];
                    for(let k = 0; k < BruteForceTab.length; k++){
                        TempTab[k] = BruteForceTab[k].slice();
                    }

                    //Left
                    let SavedJ = j - 1;
                    while(SavedJ > -1 && TempTab[i][SavedJ] != -1 && TempTab[i][SavedJ].Down == undefined && 
                        TempTab[i][SavedJ].Right == undefined){
                            if(TempTab[i][SavedJ].length > 1){
                                TempTab[i][SavedJ] = [TempTab[i][SavedJ][z]];
                            }
                        SavedJ--;
                    }

                    //Right
                    SavedJ = j + 1;
                    while(SavedJ < width && TempTab[i][SavedJ] != -1 && TempTab[i][SavedJ].Down == undefined && 
                        TempTab[i][SavedJ].Right == undefined){
                            if(TempTab[i][SavedJ].length > 1){
                                TempTab[i][SavedJ] = [TempTab[i][SavedJ][z]];
                            }
                        SavedJ++;
                    }

                    TempTab[i][j] = [BruteForceTab[i][j][z]];

					if(IsTwoNumbersCollide(TempTab) == false){
						let bool = BruteForce(TempTab, level + 1);

						if(bool){
							return true;
						}
					}
                }
					
				break;
            }
        }
    }
    else{
		
		for(let a = 0; a < ArrayOfNumbers.length; a++){
			let i = ArrayOfNumbers[a].i;
			let j = ArrayOfNumbers[a].j;
			if(BruteForceTab[i][j].length == 1){
				let check = false;
				for(let k = 0; k < Finish.length; k++){
					if(Finish[k].i == i && Finish[k].j == j){
						check = true;
						break;
					}
				}
				if(!check){
					document.getElementById('Kakuro').rows[i].cells[j].children[0].value = BruteForceTab[i][j][0];
					document.getElementById('Kakuro').rows[i].cells[j].children[0].style.color = "red";
				}
			}
		}
	
        if(KakuroIsCorrect(BruteForceTab)){
            for(let k = 0; k < BruteForceTab.length; k++){
                Tab[k] = BruteForceTab[k].slice();
            }
            return true;
        }
    }

    return false;
}

function KakuroIsCorrect(Table){

    for(let a = 0; a < ArrayOfSums.length; a++){
		let i = ArrayOfSums[a].i;
		let j = ArrayOfSums[a].j;
        if(Table[i][j].Down != undefined){
            let SavedI = i + 1;
            let Sum = 0;
            while(SavedI < height && Table[SavedI][j] != -1 && 
            Table[SavedI][j].Down == undefined && Table[SavedI][j].Right == undefined){
                Sum += Table[SavedI][j][0];
                SavedI++;
            }
				
            if(Table[i][j].Down != Sum){
                return false;
            }
        }
        if(Table[i][j].Right != undefined){
            let SavedJ = j + 1;
            let Sum = 0;
            while(SavedJ < width && Table[i][SavedJ] != -1 && 
            Table[i][SavedJ].Down == undefined && Table[i][SavedJ].Right == undefined){
                Sum += Table[i][SavedJ][0];
                SavedJ++;
            }

            if(Table[i][j].Right != Sum){
                return false;
            }
        }
    }

    return true;

}


function IsTwoNumbersCollide(Table){

	for(let a = 0; a < ArrayOfNumbers.length; a++){
		let i = ArrayOfNumbers[a].i;
		let j = ArrayOfNumbers[a].j;
        if(Table[i][j].length == 1){

            //Up
            let SavedI = i - 1;
            while(SavedI > - 1 && Table[SavedI][j] != -1 && Table[SavedI][j].Down == undefined
            && Table[SavedI][j].Right == undefined){
                if(Table[SavedI][j].length == 1 && Table[SavedI][j][0] == Table[i][j][0]){
                    return true;
                }
                SavedI--;
            }

            //Down
            SavedI = i + 1;
            while(SavedI < height && Table[SavedI][j] != -1 && Table[SavedI][j].Down == undefined
            && Table[SavedI][j].Right == undefined){
                if(Table[SavedI][j].length == 1 && Table[SavedI][j][0] == Table[i][j][0]){
					return true;
                }
                SavedI++;
            }
        }
   }

    return false;
}

var width;
var height;
var Tab;
var ArrayOfNumbers;
var ArrayOfSums;

var Finish;