const uploadArea = document.getElementById('upload-area');
const roomPlan = document.getElementById('room-plan');
const furniture = document.getElementById('furniture');
let offset = { x: 0, y: 0 };
let activeElement = null;

uploadArea.addEventListener('dragover', function(e) {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#f0f0f0';
});

uploadArea.addEventListener('dragleave', function() {
  uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', function(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    roomPlan.src = event.target.result;
    roomPlan.style.display = 'block';
    uploadArea.style.display = 'none';

    const fd = new FormData();
    fd.append('file', file)
    fetch("/image/upload/", {
      method: "POST",
      body: fd
    })

    alert('Изображение успешно загружено');
  }

  reader.readAsDataURL(file);
});
let initialX = 0;
let initialY = 0;
// Обработчик события mousedown для предметов мебели
document.querySelectorAll('.furniture-item').forEach(function(item) {
  item.addEventListener('mousedown', function(event) {
    document.querySelectorAll('.furniture-item').forEach(function(item) {
      item.classList.remove('active');
    });
      activeElement = item;
      let furnitureRect = activeElement.getBoundingClientRect()
      initialX = furnitureRect.left;
      initialY = furnitureRect.top;
      console.log(furnitureRect);
      item.style.position = 'absolute';

      let roomPlanRect = roomPlan.getBoundingClientRect();
      let elementRect = activeElement.getBoundingClientRect();
      if (
        elementRect.left >= roomPlanRect.left &&
        elementRect.right <= roomPlanRect.right &&
        elementRect.top >= roomPlanRect.top &&
        elementRect.bottom <= roomPlanRect.bottom
      ) {
        activeElement.classList.add('active');
        activeElement.classList.add('inPicture');
        // Получаем все элементы на блоке фотографий
        let furnitureBlockElements = document.querySelectorAll('.inPicture');
        let itemsArray = Array.from(furnitureBlockElements);
        // Проверяем каждую категорию мебели
        ['sofa', 'table', 'toilet', 'TV'].forEach(function(category) {
        // Считаем количество элементов в текущей категории
        let categoryCount = itemsArray.filter(function(element) {
        return element.classList.contains(category);
        }).length;
        if(categoryCount > 1){
          activeElement.style.position = 'static';
          activeElement.style.width = 'auto';
          activeElement.style.height = '50px';
          activeElement.classList.remove('active');
          activeElement.classList.remove('inPicture');
        }
      })
      }
  });
});

// Обработчик события mousemove для изменения позиции активного элемента мебели
document.addEventListener('mousemove', function(event) {
  if (activeElement) {
      activeElement.style.left = (event.clientX - offset.x) + 'px';
      activeElement.style.top = (event.clientY - offset.y) + 'px';
  }
});

document.querySelectorAll('.furniture-item').forEach(function(item) {
  item.addEventListener('mouseup', function(event) {
    activeElement = item;
    let roomPlanRect = roomPlan.getBoundingClientRect();
    let elementRect = activeElement.getBoundingClientRect();
    if (elementRect.left < roomPlanRect.left || elementRect.right > roomPlanRect.right || elementRect.top < roomPlanRect.top || elementRect.bottom > roomPlanRect.bottom) {
      activeElement.style.position = 'static';
      activeElement.style.width = 'auto';
      activeElement.style.height = '50px';
      activeElement.classList.remove('inPicture');
    }
    activeElement = null;
  });
});

// Обработчики событий click для изменения размера активного элемента мебели
const increase = () => {
  element = document.getElementsByClassName('active')[0]
  element.style.width = (parseFloat(element.width) * 1.1) + 'px';
  element.style.height = (parseFloat(element.height) * 1.1) + 'px';
}

const decrease = () => {
  element = document.getElementsByClassName('active')[0]
  element.style.width = (parseFloat(element.width) * 0.9) + 'px';
  element.style.height = (parseFloat(element.height) * 0.9) + 'px';
}
