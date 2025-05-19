<!doctype html>
<html lang="en">
<head>
  <?php echo app('Illuminate\Foundation\Vite')('resources/side/edwin/mab-project/js/main.js'); ?>
  <?php echo app('Illuminate\Foundation\Vite')('resources/side/edwin/mab-project/css/styles.css'); ?>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  
  <title>MAB on the moon</title>
</head>
<body>
  <div id="app"></div>

  <div id="start-screen">
    <div id="gameName">MAB on the Moon</div>
    <div id="buttons">
      <button type="button" class="button" id="playButton">Play!</button>
      <button type="button" class="button" id="helpButton">Help</button>
      <button type="button" class="button" id="controlsButton">Controls</button>
    </div>
    <button type="button" class="button" id="backButton">Back</button>
    <button type="button" class="button" id="restartButton">Restart</button>
  </div>
  
  <div id="help-screen" class="playerInformation">
    A grand cosmic event has occured that has shifted the Flinders Tonsley MAB from its earthly location to the moon.
    Water has been scattered around in the form of jerry cans. It is up to you to use the limited time 
    you have to search for as many as you can. You have 2 minutes to search the MAB area and they are worth 100 points each.
  </div>
  
  <div id="controls-screen" class="playerInformation">
    Point forward - move forward
    <br><br/>
    Point down - move backward
    <br><br/>
    Point right - move camera right
    <br><br/>
    Point left - move camera left
    <br><br/>
    Stop (hand flat) - stop all movement
  </div>

  <div id="final-score" class="playerInformation">Final</div>

  <div id="info">
    <div id="time-remaining">Time remaining:</div>
    <div id="player-score"></div>
  </div>
  
  <div id="status"></div>

  <div id="leaderboard">
    <h2>Leaderboard</h2>
    <ol>
        <?php $__currentLoopData = $topScores; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $score): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li>
                <?php echo e($score->user ? $score->user->name : 'Anonymous'); ?> - <?php echo e($score->score); ?>

            </li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ol>
  </div>

  <video id="webcam" autoplay playsinline style="display: none;"></video>

  <script>
    document.getElementById('playButton').addEventListener('click', function() {
      document.getElementById('leaderboard').style.display = 'none';
    });
  </script>
</body>
</html>
<?php /**PATH /var/www/html/resources/views/side/edwin/mab-project.blade.php ENDPATH**/ ?>