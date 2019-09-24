// Задання параметрів, які визначають процес кластеризації
const K = 3;
const THETA_N = 1;
const THETA_S = 1;
let THETA_C = 3;
const L = 1;
const I = 4;
let Nc = 1;

let Clusters = new Array();
let Z = new Array();
let Di = new Array();
let D;
let sdArray = new Array();
let maxSdArray = new Array();

let extraArrayX = new Array();
let extraArrayY = new Array();

let points = [];
let html = "";

const enterCoordinates = () => {
  const coordinates = document.getElementById("points").value;
  var p = coordinates.split(",").map(Number);
  points = p;
  clusterization();
};

let PointsArray = new Array();

// Додавання початкового кластера
const addingInitialCluster = () => {
  let clusterItems = new Array();
  for (let j = 0, k = 0; j < points.length / 2; j++, k += 2) {
    let item = [points[k], points[k + 1]];
    clusterItems.push(item);
  }
  Clusters.push(clusterItems);
  PointsArray.push(clusterItems);
};

// Вибір початкового центру кластера
const initialCenter = () => {
  Z.push([points[0], points[1]]);
  html += `<b>1.</b> Координати початкового центра <b>Z1</b>:(${Z}) <br>`;
};

// Знаходження індекса мінімального елемента масиву
const minValue = items => {
  let minNumber = items[0];
  for (let i = 0; i < items.length; i++) {
    if (minNumber > items[i]) minNumber = items[i];
  }
  let id = items.indexOf(minNumber);
  return id;
};

// Розподілення точок по кластерам
const pointsDistribution = () => {
  let newClusters = [];
  for (let i = 0; i < Nc; i++) {
    newClusters.push([]);
  }

  for (let i = 0; i < PointsArray[0].length; i++) {
    let distances = new Array();
    for (let j = 0; j < Z.length; j++) {
      distances.push(
        Math.sqrt(
          Math.pow(Z[j][0] - PointsArray[0][i][0], 2) +
            Math.pow(Z[j][1] - PointsArray[0][i][1], 2)
        )
      );
    }

    newClusters[minValue(distances)].push(PointsArray[0][i]);
  }
  Clusters = newClusters;
};

// функція виводу координат кластера
const printClustersCoordinates = () => {
  html += "<b>2.</b> Координати точок кластерів<br><br>";
  for (let i = 0; i < Nc; i++) {
    html += `Кластер <b>S${i + 1}</b>:<br>`;
    for (let j = 0; j < Clusters[i].length; j++) {
      for (let k = 0; k < Clusters[i][j].length - 1; k++) {
        let x = Clusters[i][j][k];
        let y = Clusters[i][j][k + 1];
        html += `(${x};${y})<br>`;
      }
    }
  }
};

// Ліквідація підмножини точок
const clusterLiquidation = () => {
  for (let i = 0; i < Nc; i++) {
    if (Clusters[i].length < THETA_N) {
      Clusters.splice(i, 1);
      Nc--;
    }
  }
};

// Корегування центру кластера
const centering = () => {
  for (let i = 0; i < Nc; i++) {
    let x = 0;
    let y = 0;
    for (let j = 0; j < Clusters[i].length; j++) {
      for (let k = 0; k < Clusters[i][j].length - 1; k++) {
        x += Clusters[i][j][k];
        y += Clusters[i][j][k + 1];
      }
    }
    let newX = (1 / Clusters[i].length) * x;
    let newY = (1 / Clusters[i].length) * y;

    Z[i] = [newX, newY];
  }
  html += `<br><b>4.</b> Координати відкорегованих центрів:<br>${Z}`;
};

// Знаходження середньої відстані між точками і центрами кластерів
const averageInnerDistance = () => {
  let DiArrayValue = [];
  for (let i = 0; i < Nc; i++) {
    DiArrayValue.push([]);
  }

  for (let i = 0; i < Nc; i++) {
    let sumDistances = 0;
    for (let j = 0; j < Clusters[i].length; j++) {
      sumDistances += Math.sqrt(
        Math.pow(Z[i][0] - Clusters[i][j][0], 2) +
          Math.pow(Z[i][1] - Clusters[i][j][1], 2)
      );
    }

    DiArrayValue[i] = (1 / Clusters[i].length) * sumDistances;
  }
  Di = DiArrayValue;
  html += `<br><b>5.</b> Середні відстані між точками і центрами кластерів:<br>${Di}`;
};

// Знаходження узагальненої середньої відстані
// між точками, які знаходяться в різних кластерах
// та відповідними їм центрами
const averageExternalDistance = () => {
  let sumD = 0;
  for (let i = 0; i < Nc; i++) {
    sumD += Clusters[i].length * Di[i];
  }
  let d = (1 / PointsArray[0].length) * sumD;

  D = d;
  html += `<br><b>6.</b> Узагальнена середня відстань:<br>${D}`;
};

// Standard deviation part 1
let getMean = data => {
  return (
    data.reduce((a, b) => {
      return Number(a) + Number(b);
    }) / data.length
  );
};
// Standard deviation part 2
let getSD = data => {
  let m = getMean(data);
  return Math.sqrt(
    data.reduce(function(sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) /
      (data.length - 1)
  );
};

// Знаходження середньоквадратичного відхилення
const standardDeviation = () => {
  let sd = [];

  for (let i = 0; i < Nc; i++) {
    sd.push([]);
  }

  for (let i = 0; i < Nc; i++) {
    let xArray = new Array();
    let yArray = new Array();
    for (let j = 0; j < Clusters[i].length; j++) {
      for (let k = 0; k < Clusters[i][j].length - 1; k++) {
        xArray.push(Clusters[i][j][k]);
        yArray.push(Clusters[i][j][k + 1]);
      }
    }
    sd[i].push(getSD(xArray));
    sd[i].push(getSD(yArray));
  }
  sdArray = sd;
  html += `<br><b>8.</b> Середньоквадратичні відхиленя:<br>${sdArray}`;
};

// Знаходження максимального значення середньоквадратичного відхилення
let maxStandardDeviationValue = () => {
  let maxSd = [];

  for (let i = 0; i < sdArray.length; i++) {
    maxSd.push([]);
  }

  for (let i = 0; i < Nc; i++) {
    let max = 0;
    for (let j = 0; j < 1; j++) {
      if (sdArray[i][j] > sdArray[i][j + 1]) {
        max = sdArray[i][j];
      } else {
        max = sdArray[i][j + 1];
      }
    }
    maxSd[i] = max;
  }
  maxSdArray = maxSd;
  html += `<br><b>9.</b> Максимальна компонента середньоквадратичного відхиленння<br>${maxSdArray}`;
};

// Розбиття кластера
const clusterDivision = () => {
  for (let i = 0; i < maxSdArray.length; i++) {
    if (maxSdArray[i] > THETA_S) {
      if (
        (Di[i] > D && Clusters[i].length > 2 * (THETA_N + 1)) ||
        Nc <= K / 2
      ) {
        let v = 0.5 * maxSdArray[i];
        let xPlus = Z[i][0];
        let xMinus = Z[i][0];
        let y = Z[i][1];
        xPlus += v;
        xMinus -= v;

        let z1 = [xPlus, y];
        let z2 = [xMinus, y];

        Z.splice(i, 1);
        Z.splice(i, 2, z1, z2);

        Nc++;
        html += `<br><br><b>10.</b> Відбувся поділ кластера <b>S${i +
          1}</b><br>`;
      }
    }
  }
};

/////// Візуалізація роботи алгоритму ///////
const getData = () => {
  for (let i = 0; i < Nc; i++) {
    let xArr = new Array();
    for (let j = 0; j < Clusters[i].length; j++) {
      xArr[j] = Clusters[i][j][0];
    }
    extraArrayX[i] = xArr;
  }

  for (let i = 0; i < Nc; i++) {
    let yArr = new Array();
    for (let j = 0; j < Clusters[i].length; j++) {
      yArr[j] = Clusters[i][j][1];
    }
    extraArrayY[i] = yArr;
  }
  start();
};

const start = () => {
  var data = [];

  for (let i = 0; i < Nc; i++) {
    let name = `S${i + 1}`;
    data.push({
      x: extraArrayX[i],
      y: extraArrayY[i],
      mode: "markers",
      type: "scatter",
      name: name,
      marker: { size: 12 }
    });
  }

  Plotly.newPlot("container", data, { showSendToCloud: false });
};
//////////////////////////////////////////////////

// Реалізація алгоритму ISODATA
const clusterization = () => {
  // Крок 1
  addingInitialCluster();
  initialCenter(points);

  for (let i = 0; i < I; i++) {
    // Крок 2
    pointsDistribution();
    printClustersCoordinates();

    // Крок 3
    clusterLiquidation();

    // Крок 4
    centering();

    // Крок 5
    averageInnerDistance();

    // Крок 6
    averageExternalDistance();

    // Крок 7
    if (i == 3) {
      THETA_C = 0;
      // distanceBetweenAllClustersCenter();
      getData();
      html += `<br><br>Кінець ${i +
        1} ітерації -----------------------><br><br>`;
      document.getElementById("math").innerHTML = html;
      break;
    } else if ((i + 1) % 2 == 0 || Nc >= 2 * K) {
      // distanceBetweenAllClustersCenter();
      html += `<br><br>Кінець ${i +
        1} ітерації -----------------------><br><br>`;
      document.getElementById("math").innerHTML = html;
      continue;
    }

    // Крок 8
    standardDeviation();

    // Крок 9
    maxStandardDeviationValue(); // переписати!

    // Крок 10
    clusterDivision();
    html += `<br>Кінець ${i + 1} ітерації -----------------------><br><br>`;
    document.getElementById("math").innerHTML = html;
  }
};
