document.addEventListener('DOMContentLoaded', function () {
  const confirmDeleteModal = document.getElementById('confirmDeleteModal');

  if (confirmDeleteModal) {
    confirmDeleteModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const courseId = button.getAttribute('data-id');
      const courseName = button.getAttribute('data-name');

      const form = confirmDeleteModal.querySelector('#deleteForm');
      const courseNameSpan = confirmDeleteModal.querySelector('#modalCourseName');

      form.action = `/majors/delete/${courseId}`;
      courseNameSpan.textContent = courseName;
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('confirmUserDeleteModal');

  if (!modal) return;

  modal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    const userName = button.getAttribute('data-name');

    const form = modal.querySelector('#userDeleteForm');
    const nameSpan = modal.querySelector('#userNameInModal');

    form.action = `/users/delete/${userId}`;
    nameSpan.textContent = userName;
  });
});

