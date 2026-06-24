/**
 * IRepository — Abstract base class (Interface contract).
 * All concrete repository implementations must extend this class
 * and override every method. This enforces the Dependency Inversion
 * and Interface Segregation principles from SOLID.
 */
export class IRepository {
  /**
   * Retrieve all records, optionally filtered.
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async findAll(filters) {
    throw new Error('Not implemented');
  }

  /**
   * Retrieve a single record by its ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    throw new Error('Not implemented');
  }

  /**
   * Persist a new record.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    throw new Error('Not implemented');
  }

  /**
   * Update an existing record by ID.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async update(id, data) {
    throw new Error('Not implemented');
  }

  /**
   * Delete a record by ID.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Not implemented');
  }

  /**
   * Retrieve the change history of a single record by its ID.
   * @param {string} id
   * @returns {Promise<Array>}
   */
  async getHistory(id) {
    throw new Error('Not implemented');
  }

  /**
   * Retrieve all history events across every record, sorted newest-first.
   * Each event is annotated with todoId and todoTitle.
   * @returns {Promise<Array>}
   */
  async getAllHistory() {
    throw new Error('Not implemented');
  }
}
