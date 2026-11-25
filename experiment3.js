const gradeForm = document.getElementById('gradeForm');
const gradeResult = document.getElementById('gradeResult');

function getGrade(marks) {
  if (marks >= 90) return 'A';
  if (marks >= 80) return 'B';
  if (marks >= 70) return 'C';
  if (marks >= 60) return 'D';
  return 'F';
}

gradeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  gradeResult.classList.remove('error');

  const student = gradeForm.elements.student.value.trim();
  const marksValue = gradeForm.elements.marks.value.trim();
  const marks = Number(marksValue);

  if (!student || marksValue === '' || !Number.isFinite(marks) || marks < 0 || marks > 100) {
    gradeResult.textContent = 'Enter a student name and a valid mark from 0 to 100.';
    gradeResult.classList.add('error');
    return;
  }

  const grade = getGrade(marks);
  const outcome = grade === 'F' ? 'Keep practicing—you can improve.' : 'Well done!';
  gradeResult.textContent = `${student} scored ${marks}/100. Grade: ${grade}. ${outcome}`;
});
