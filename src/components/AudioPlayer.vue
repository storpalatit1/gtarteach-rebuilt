
<script>
export default {
  data() {
    return {
      audio: null,
    };
  },
  methods: {
    initAudio(src) {
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      this.audio = new Audio(src);
      this.audio.volume = 1.0;
      this.audio.muted = false;

      this.audio.addEventListener("canplaythrough", () => {
        console.log("Sucessfully loaded the audio", src);
      });

      this.audio.addEventListener("error", () => {
        console.error("Failed to load the audio", src);
      });
       this.audio.play().catch(err => {
    console.error("Playback failed:", err);
  });
    },
    
  }
};
</script>