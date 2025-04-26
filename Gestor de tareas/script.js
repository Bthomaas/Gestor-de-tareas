document.addEventListener("DOMContentLoaded", () => {
    //Las variables
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");
    const deletedList = document.getElementById("deletedList");
    const restoreBtn = document.getElementById("restoreTasks");
    const clearBtn = document.getElementById("clearTasks");
  
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");
  
    //Confirmaciones
    const confirmModal = document.getElementById("confirmModal");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
  
    //Guardados en el localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function showToast(message, type = "success") {
      toastMsg.textContent = message;
  
      if (type === "success") {
        toast.className = "fixed top-5 right-5 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded shadow-lg animate-fadeIn z-50";
        toastIcon.setAttribute("data-lucide", "check-circle");
      } else if (type === "error") {
        toast.className = "fixed top-5 right-5 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded shadow-lg animate-fadeIn z-50";
        toastIcon.setAttribute("data-lucide", "x-circle");
      }
  
      lucide.createIcons();
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3000);
    }
  
    function renderTasks() {
      taskList.innerHTML = "";
      completedList.innerHTML = "";
      deletedList.innerHTML = "";
  
      const sortedTasks = tasks.sort((a, b) => b.date - a.date);
  
      sortedTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-800 px-4 py-2 rounded transition-all hover:bg-gray-700 animate-fadeIn";
  
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
  
        const controls = document.createElement("div");
        controls.className = "flex gap-2";
  
        if (task.status === "deleted") {
          li.classList.add("text-red-400");
          deletedList.appendChild(li);
          li.appendChild(taskText);
        } else {
          const doneBtn = document.createElement("button");
          doneBtn.innerHTML = `<i data-lucide="${task.status === 'completed' ? 'rotate-ccw' : 'check'}"></i>`;
          doneBtn.className = "hover:text-green-400";
          doneBtn.onclick = () => toggleComplete(index);
  
          const deleteBtn = document.createElement("button");
          deleteBtn.innerHTML = `<i data-lucide="trash"></i>`;
          deleteBtn.className = "hover:text-red-400";
          deleteBtn.onclick = () => deleteTask(index);
  
          controls.appendChild(doneBtn);
          controls.appendChild(deleteBtn);
  
          li.appendChild(taskText);
          li.appendChild(controls);
  
          if (task.status === "completed") {
            li.classList.add("bg-green-900", "text-green-300");
            completedList.appendChild(li);
          } else {
            taskList.appendChild(li);
          }
        }
      });
  
      lucide.createIcons();
    }

    let obj = {
        oculto: {
          mensaje: "Aplicación creada por Thomas Bustamante"
        }
      };

    //Funcion agregar a la lista
    function addTask() {
      const text = taskInput.value.trim();
      if (text === "") return showToast("La tarea no puede estar vacía", "error");
  
      tasks.push({ text, status: "pending", date: Date.now() });
      saveTasks();
      taskInput.value = "";
      renderTasks();
      showToast("Tarea añadida correctamente");
    }
  
    //Funcion tarea completada
    function toggleComplete(index) {
      if (tasks[index].status === "completed") {
        tasks[index].status = "pending";
      } else {
        tasks[index].status = "completed";
      }
      saveTasks();
      renderTasks();
    }
  
    //Funcion tarea borrada
    function deleteTask(index) {
      tasks[index].status = "deleted";
      saveTasks();
      renderTasks();
      showToast("Tarea eliminada", "error");
    }
  
    //Funcion recuperacion de tarea
    function restoreTasks() {
      let restored = 0;
      tasks = tasks.map(task => {
        if (task.status === "deleted") {
          restored++;
          return { ...task, status: "pending" };
        }
        return task;
      });
      saveTasks();
      renderTasks();
      showToast(`${restored} tareas restauradas`);
    }
  
    //Funcion borrar las tareas
    function clearTasks() {
      confirmModal.classList.remove("hidden");
    }
  
    confirmDelete.onclick = () => {
      tasks = [];
      saveTasks();
      renderTasks();
      confirmModal.classList.add("hidden");
      showToast("Todas las tareas han sido eliminadas", "error");
    };
  
    cancelDelete.onclick = () => {
      confirmModal.classList.add("hidden");
    };
  
    addTaskBtn.onclick = addTask;
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask();
    });
  
    restoreBtn.onclick = restoreTasks;
    clearBtn.onclick = clearTasks;
  
    renderTasks();

    
    console.log(obj.oculto.mensaje);
});


