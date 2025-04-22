const gradePoints = {
  s: 10,
  a: 9,
  b: 8,
  c: 7,
  d: 6,
  e: 5,
  f: 0,
};

const form = document.getElementById('gpaForm');
const frequentGradeSelect = document.getElementById('frequentGrade');
const improvedGradeSelect = document.getElementById('improvedGrade');
const otherGradesSection = document.getElementById('otherGradesSection');
const otherGradesInputs = document.getElementById('otherGradesInputs');
const resultDiv = document.getElementById('result');

// Animate dropdown for other grades
frequentGradeSelect.addEventListener('change', () => {
  const selected = frequentGradeSelect.value;
  otherGradesInputs.innerHTML = '';

  Object.keys(gradePoints).forEach((grade) => {
    if (grade !== selected) {
      const label = document.createElement('label');
      label.textContent = `Credits for '${grade.toUpperCase()}' grade:`;

      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.value = 0;
      input.id = `grade-${grade}`;

      otherGradesInputs.appendChild(label);
      otherGradesInputs.appendChild(input);
    }
  });

  otherGradesSection.classList.add('show');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const totalCredits = parseInt(document.getElementById('totalCredits').value);
  const creditsDone = parseInt(document.getElementById('creditsDone').value);
  const targetCGPA = parseFloat(document.getElementById('targetCGPA').value);

  const frequentGrade = frequentGradeSelect.value;
  const improvedGrade = improvedGradeSelect.value;

  if (!frequentGrade || !improvedGrade) {
    alert("Please select both grade options.");
    return;
  }

  const freqPoints = gradePoints[frequentGrade];
  const improvedPoints = gradePoints[improvedGrade];

  let currentPoints = 0;
  let creditsFromOtherGrades = 0;

  Object.keys(gradePoints).forEach((grade) => {
    if (grade !== frequentGrade) {
      const input = document.getElementById(`grade-${grade}`);
      const credits = parseInt(input?.value || "0");
      currentPoints += credits * gradePoints[grade];
      creditsFromOtherGrades += credits;
    }
  });

  const frequentCredits = creditsDone - creditsFromOtherGrades;
  currentPoints += frequentCredits * freqPoints;

  const remainingCredits = totalCredits - creditsDone;
  const totalPointsNeeded = targetCGPA * totalCredits;
  const remainingPointsNeeded = totalPointsNeeded - currentPoints;
  const defaultPoints = freqPoints * remainingCredits;

  let resultText = `Your current CGPA is ${(currentPoints / creditsDone).toFixed(3)}\nTo reach a CGPA of ${targetCGPA}:\n`;

  if (improvedPoints <= freqPoints) {
    resultText += "Improved grade must be higher than your frequent grade!";
  } else {
    const extraCreditsNeeded = (remainingPointsNeeded - defaultPoints) / (improvedPoints - freqPoints);

    if (extraCreditsNeeded <= 0) {
      resultText += `Score grade '${frequentGrade.toUpperCase()}' in all remaining ${remainingCredits} credits.`;
    } else if (extraCreditsNeeded > remainingCredits) {
      resultText += `Not achievable — you'd need ${(extraCreditsNeeded).toFixed(2)} improved-grade credits, but only ${remainingCredits} remain.`;
    } else {
      const ceilImproved = Math.ceil(extraCreditsNeeded);
      resultText += `Score grade '${improvedGrade.toUpperCase()}' in ${ceilImproved} credits\nScore grade '${frequentGrade.toUpperCase()}' in remaining ${remainingCredits - ceilImproved} credits`;
    }
  }

  resultDiv.textContent = resultText;
  resultDiv.style.display = 'block';
});
