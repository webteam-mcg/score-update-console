<template>
      <div id="setup">
          <h1>Match Setup</h1>
          <hr>
          <h2>Toss won by</h2>
          <label>
              <input type="radio" name="team" value="mcg">
              <span class="spacer">MCG</span>
        </label>
        <br><br>
        <label>
            <input type="radio" name="team" value="rcg">
            <span class="spacer">RCG</span>
      </label>
      <h2>Elected to</h2>
      <label>
          <input type="radio" name="opt" value="bat">
          <span class="spacer">Bat</span>
    </label>
    <br><br>
    <label>
        <input type="radio" name="opt" value="bowl">
        <span class="spacer">Bowl</span>
    </label>
    <button class="button">Start Match</button>
      </div>
</template>

<style>

  #setup{
    margin: auto;
    width: 80%;
    padding: 10px;
    float: right;
}
</style>