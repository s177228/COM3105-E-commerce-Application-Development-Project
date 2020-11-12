window.addEventListener("DOMContentLoaded", (evt) => {
  init_delete_btn();
});

const init_delete_btn = () => {
  var list = document.getElementsByClassName("delete-btn");
  for (let item of list) {
    let value = JSON.parse(item.value);
    item.addEventListener("click", (e) => {
      var r = confirm(`Are you sure to delete item "${value.name}"`);
      if (r == true) {
        fetch(`/api/item/delete/${value.id}`).then((res) => {
          if (res.status == 200) {
            window.location.href = window.location.href;
          }
        });
      }
    });
  }
};
