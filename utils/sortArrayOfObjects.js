arraysort = (data, property, ascDsc) => {
  console.log(
    "Inside arraysort data:",
    data,
    " property:",
    property,
    " ascDsc:",
    ascDsc
  );
  let sorted;
  sorted = data.sort(compare(property, ascDsc));

  return sorted;
};

// sortOn = (property, ascDsc) => {
//   // sortOn = (a, b) => {

//   let updown = 1;
//   if (ascDsc === "asc") {
//     updown = -1;
//   }

//   return function(a, b) {
//     if (a[property].toUpperCase() > b[property].toUpperCase()) {
//       return 1 * updown;
//     } else if (a[property].toUpperCase() < b[property].toUpperCase()) {
//       return -1 * updown;
//     } else {
//       return 0;
//     }
//   };
// };

compare = (property, ascDsc) => {
  let updown = 1;
  if (ascDsc === "asc") {
    updown = -1;
  }
  return function(a, b) {
    const A = a[property].toUpperCase();
    const B = b[property].toUpperCase();
    console.log("A:", A, " B:", B);
    if (A > B) {
      return 1 * updown;
    } else if (A < B) {
      return -1 * updown;
    } else {
      return 0;
    }
  };
};

// compareHardCoded = (a, b) => {
//   const A = a.itemName.toUpperCase();
//   const B = b.itemName.toUpperCase();
//   console.log("A:", A, " B:", B);
//   let comparison = 0;
//   if (A > B) {
//     comparison = 1;
//   } else if (A < B) {
//     comparison = -1;
//   }

//   return comparison;
// };

module.exports = arraysort;
