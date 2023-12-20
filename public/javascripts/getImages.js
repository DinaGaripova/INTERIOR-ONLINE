fetch("/image/")
  .then(result=>result.json())
  .then(data=>{
    let divHistory = document.getElementById('historyLoad')

    data.sort((a, b) => a.timestamp - b.timestamp).forEach(photo => {
      let container = document.createElement('div')
      let blockImg = document.createElement('img')
      blockImg.src = `/images/${photo.path}`
      container.appendChild(blockImg)
      let blockDate = document.createElement('p')
      blockDate.textContent = `Дата загрузки: ${photo.date} ${photo.time}`
      container.appendChild(blockDate)
      divHistory.appendChild(container)
    });
  })