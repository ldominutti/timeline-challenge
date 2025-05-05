<template>
    <div v-if="show" class="toast" :class="type" @mouseenter="pauseTimeout" @mouseleave="resumeTimeout" role="status"
        aria-live="polite" aria-atomic="true">
        {{ message }}
        <button @click="closeToast" class="toast-close" @focus="pauseTimeout" @blur="resumeTimeout">
            ×
        </button>
    </div>
</template>

<script>
export default {
    name: 'AppToast',
    data() {
        return {
            show: false,
            message: '',
            type: 'info',
            timeoutId: null,
            duration: 5000,
            remainingTime: 5000,
            startTime: null,
            isPaused: false
        }
    },
    methods: {
        showToast(message, type = 'info', duration = 3000) {
            this.message = message
            this.type = type
            this.duration = duration
            this.remainingTime = duration
            this.show = true

            this.startTimer()
        },

        startTimer() {
            this.clearTimer()
            this.startTime = Date.now()
            this.timeoutId = setTimeout(() => {
                this.closeToast()
            }, this.remainingTime)
        },

        pauseTimeout() {
            if (!this.timeoutId || this.isPaused) return

            clearTimeout(this.timeoutId)
            this.remainingTime -= (Date.now() - this.startTime)
            this.isPaused = true
        },

        resumeTimeout() {
            if (!this.isPaused) return

            this.startTimer()
            this.isPaused = false
        },

        closeToast() {
            this.clearTimer()
            this.show = false
        },

        clearTimer() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId)
                this.timeoutId = null
            }
        }
    },

    beforeDestroy() {
        this.clearTimer()
    }
}
</script>

<style scoped>
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 450px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: none;
}

.toast:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
}

.toast.error {
    background-color: #f44336;
}

.toast.success {
    background-color: #4caf50;
}

.toast-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-left: 10px;
    padding: 0 5px;
}

.toast-close:focus {
    outline: 2px solid white;
    outline-offset: 2px;
}
</style>