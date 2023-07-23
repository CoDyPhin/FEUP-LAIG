class KeyFrameAnimation extends Animation{
    constructor(scene, id, keyframes, matrix) {
        super(scene, id);
        this.currKeyframe = 0;
        this.keyframes = keyframes;
        this.startedMovement = false;
        this.total = false;
        this.startTime = 0;
        this.elapsedTime = 0;

        if (matrix == null) matrix = mat4.create();
        this.transfMatrix = matrix;
    }

    interpolate(keyframe, nextKeyframe, type){
        var temp1, temp2, temp3;
        if (this.currKeyframe < this.keyframes.length - 1){
            switch(type){
                case "translation":
                    temp1 = keyframe.translations[0] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.translations[0] - keyframe.translations[0]) / (nextKeyframe.instant - keyframe.instant));
                    temp2 = keyframe.translations[1] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.translations[1] - keyframe.translations[1]) / (nextKeyframe.instant - keyframe.instant));
                    temp3 = keyframe.translations[2] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.translations[2] - keyframe.translations[2]) / (nextKeyframe.instant - keyframe.instant));
                    break;
                case "rotation":
                    temp1 = keyframe.rotations[0] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.rotations[0] - keyframe.rotations[0]) / (nextKeyframe.instant - keyframe.instant));
                    temp2 = keyframe.rotations[1] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.rotations[1] - keyframe.rotations[1]) / (nextKeyframe.instant - keyframe.instant));
                    temp3 = keyframe.rotations[2] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.rotations[2] - keyframe.rotations[2]) / (nextKeyframe.instant - keyframe.instant));
                    break;
                case "scale":
                    temp1 = keyframe.scales[0] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.scales[0] - keyframe.scales[0]) / (nextKeyframe.instant - keyframe.instant));
                    temp2 = keyframe.scales[1] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.scales[1] - keyframe.scales[1]) / (nextKeyframe.instant - keyframe.instant));
                    temp3 = keyframe.scales[2] + (this.elapsedTime - keyframe.instant)*((nextKeyframe.scales[2] - keyframe.scales[2]) / (nextKeyframe.instant - keyframe.instant));
                    break;
            }
        }

        return [temp1, temp2, temp3];
    }


    update(t) {
        if(this.startTime == 0) {
            this.startTime = t;
            this.startedMovement = true;
        }
        this.elapsedTime = t - this.startTime;

        if (this.currKeyframe != this.keyframes.length - 1) {
            if (this.elapsedTime >= this.keyframes[this.currKeyframe+1].instant){
                this.currKeyframe++;
            }
        }

        this.transfMatrix = mat4.create();

        if(this.currKeyframe < this.keyframes.length - 1) {
            if(this.elapsedTime >= this.keyframes[this.currKeyframe+1].instant) {
                this.currKeyframe++;
            }
        }
        else{
            this.transfMatrix = mat4.create();

            this.transfMatrix = mat4.translate(this.transfMatrix, this.transfMatrix, this.keyframes[this.currKeyframe].translations);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, this.keyframes[this.currKeyframe].rotations[0]*DEGREE_TO_RAD, [1, 0, 0]);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, this.keyframes[this.currKeyframe].rotations[1]*DEGREE_TO_RAD, [0, 1, 0]);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, this.keyframes[this.currKeyframe].rotations[2]*DEGREE_TO_RAD, [0, 0, 1]);
            this.transfMatrix = mat4.scale(this.transfMatrix, this.transfMatrix, this.keyframes[this.currKeyframe].scales);
            return;
        }

        if (this.startedMovement){
            var interpolatedTranslations = this.interpolate(this.keyframes[this.currKeyframe], this.keyframes[this.currKeyframe+1], "translation");
            var interpolatedRotations = this.interpolate(this.keyframes[this.currKeyframe], this.keyframes[this.currKeyframe+1], "rotation");
            var interpolatedScales = this.interpolate(this.keyframes[this.currKeyframe], this.keyframes[this.currKeyframe+1], "scale");
            
            this.transfMatrix = mat4.translate(this.transfMatrix, this.transfMatrix, interpolatedTranslations);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, interpolatedRotations[0]*DEGREE_TO_RAD, [1, 0, 0]);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, interpolatedRotations[1]*DEGREE_TO_RAD, [0, 1, 0]);
            this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, interpolatedRotations[2]*DEGREE_TO_RAD, [0, 0, 1]);
            this.transfMatrix = mat4.scale(this.transfMatrix, this.transfMatrix, interpolatedScales);
        }
    }

    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
}