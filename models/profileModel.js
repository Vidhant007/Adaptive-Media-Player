const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profileName: {
        type: String,
    },
    profileAcess: {
        type: Number, // represents various access levels
    },
    isMasterProfile: {
        type: Boolean,
        default: false, 
        editable: {
            onCreate: true, // allow editing during creation
            onUpdate: false, // disallow editing during update
        },
    },
});

profileSchema.pre('save', function (next) {
    // Check if isMasterProfile has been modified during an update
    if (this.isModified('isMasterProfile') && !this.isNew) {
        const err = new Error('isMasterProfile is not editable during update');
        return next(err);
    }
    next();
});

module.exports = mongoose.model('Profile', profileSchema);
