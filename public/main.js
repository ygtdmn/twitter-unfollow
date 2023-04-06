document.addEventListener('DOMContentLoaded', () => {
  const unfollowButtons = document.querySelectorAll('.unfollow');
  const addToListButtons = document.querySelectorAll('.add-to-list');
  const notification = document.getElementById('notification');

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }

  unfollowButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const userId = button.dataset.id;
      try {
        const response = await fetch(`/unfollow/${userId}`, { method: 'DELETE' });
        if (response.ok) {
          button.textContent = 'Unfollowed';
          button.classList.add('disabled');
          showNotification('User unfollowed successfully');
        } else {
          throw new Error('Failed to unfollow user');
        }
      } catch (error) {
        console.error(error);
        showNotification('An error occurred while unfollowing the user');
      }
    });
  });

  addToListButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const userId = button.dataset.id;
      try {
        const response = await fetch(`/add-to-list/${userId}`, { method: 'PUT' });
        if (response.ok) {
          button.textContent = 'Added';
          button.classList.add('disabled');
          showNotification('User added to list successfully');
        } else {
          throw new Error('Failed to add user to list');
        }
      } catch (error) {
        console.error(error);
        showNotification('An error occurred while adding the user to the list');
      }
    });
  });
});
