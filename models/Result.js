import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    trim: true
  }
});

const resultSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  individual: {
    first: positionSchema,
    second: positionSchema,
    third: positionSchema
  },
  group: {
    first: positionSchema,
    second: positionSchema,
    third: positionSchema
  }
}, {
  timestamps: true
});

export default mongoose.model('Result', resultSchema);